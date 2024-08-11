'use client';

import { ChatRecipientList } from '@/components/ChatRecipientList';
import { PageSubscribeDialog } from '@/components/PageSubscribeDialog';
import { Dropdown as DropdownMenu } from '@/components/DropdownMenu';
import withAuth from '@/components/PrivateRoute';
import { useEffect, useState } from 'react';
import { getPage, verifyUser } from '@/api/fetchAPI';

import { socket } from '@/lib/socket';
import { ChatArea } from '@/components/ChatArea';
import { isEmpty } from '@/lib/utils';
import { TOKEN_KEY } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

function Dashboard() {
  const router = useRouter();
  const [pageConnected, setPageConnected] = useState<boolean>(false);
  const [notifyNewMessage, setNotifyNewMessage] = useState<boolean>(false);
  const [page, setPage] = useState<{
    pageID: string,
    name: string,
    accessToken: string
  }>({
    pageID: '',
    name: '',
    accessToken: '',
  });
  const [username, setUsername] = useState<string>('user');
  const [recipient, setRecipient] = useState<string>('');

  useEffect(() => {
    // Get the JWT token from the cookie
    const jwtToken = sessionStorage.getItem(TOKEN_KEY) as string;

    // Fetch the page name and user info from the database
    (async () => {
      const user = await verifyUser(jwtToken);
      const page = await getPage(jwtToken);

      // If the user is connected, set the username state
      if (user.status == 'success') {
        setUsername(user.data);
      } else {
        router.replace('/?error=unauthorized');
        return;
      }

      // If the page is connected, set the page state
      if (page.status === 'success') {
        setPage(page.data);
        if (!isEmpty(page.data)) {
          setPageConnected(true);
        }
      }
    })();

  }, [router, pageConnected]);

  useEffect(() => {
    if (!pageConnected) return;

    console.log('Connecting to the server');
    
    // Connect to the socket
    const jwtToken = sessionStorage.getItem(TOKEN_KEY) as string;
    socket.auth = { token: jwtToken };
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to the server');
      
      socket.on('private_message', (data) => {
        setNotifyNewMessage(true);
      });
    });
    
    return () => {
      // Disconnect from the socket
      socket.disconnect();
    };
  }, [pageConnected]);

  return (
    <div className="flex flex-col items-center h-[100dvh]">
      <header className="bg-gradient-to-br from-blue-50 to-purple-50 border-b shadow-sm w-full h-[10vh] px-2 flex flex-row justify-between items-center">
        <span className="font-black text-2xl py-3">Socialistic</span>
        <DropdownMenu username={username} />
      </header>
      <main className="flex flex-row w-full h-[90dvh]">
        <section className="w-[350px] p-2 flex flex-col gap-2">
          {
            // If a page is connected, show page name instead of the button
            (pageConnected) ? (
              <p className="p-3 rounded-md bg-purple-900 text-white shadow-md"><strong>Page: </strong>{page.name || 'Page name'}</p>
            ) : (
            <PageSubscribeDialog
              setPageConnected={setPageConnected}
              setNotifyNewMessage={setNotifyNewMessage}
            />
            )
          }
          <ChatRecipientList 
            callback={setNotifyNewMessage} 
            newMessage={notifyNewMessage} 
            pageConnected={pageConnected} 
            page={page}
            setRecipient={setRecipient}
            />
        </section>
        <section className="w-full p-2">
          {
            // If no page is connected, show the message
            !pageConnected ? (
              <div className="flex flex-col gap-3 items-center justify-center h-full">
                <p className="text-2xl font-black">
                  Connect a page to get started
                </p>
                <PageSubscribeDialog
                  setPageConnected={setPageConnected}
                  setNotifyNewMessage={setNotifyNewMessage}
                />
              </div>
            ) : (
              // If a page is connected, show the chat box
              recipient ? (
                <ChatArea
                  newMessage={notifyNewMessage}
                  // page={page}
                  recipient={recipient}
                />
              ) : (
                <div className="flex flex-col gap-3 items-center justify-center h-full">
                  <p className="text-2xl font-medium">
                    Select a recipient to start chatting
                  </p>
                </div>
              )
            )
          }
        </section>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
