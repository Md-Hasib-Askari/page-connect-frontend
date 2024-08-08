"use client";

import Cookies from "js-cookie";
import { ChatRecipientList } from "@/components/ChatRecipientList";
import { PageSubscribeDialog } from "@/components/PageSubscribeDialog";
import DropdownMenu from "@/components/DropdownMenu";
import withAuth from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { getPage, getUser } from "@/api/fetchAPI";

import { socket } from "@/lib/socket";
import { ChatArea } from "@/components/ChatArea";

function Dashboard() {
  const [pageConnected, setPageConnected] = useState<boolean>(false);
  const [notifyNewMessage, setNotifyNewMessage] = useState<boolean>(false);
  const [page, setPage] = useState<{
    pageID: string,
    name: string,
    accessToken: string
  }>({
    pageID: '',
    name: '',
    accessToken: ''
  });
  const [username, setUsername] = useState<string>('username');
  const [recipient, setRecipient] = useState<string>('');

  useEffect(() => {
    const jwtToken = Cookies.get('token') as string;

    // Fetch the page name and user info from the database
    (async () => {
      const user = await getUser(jwtToken);
      const response = await getPage(jwtToken);

      if (user.status == 'success') {
        setUsername(user.data)
      }
      if (response.status === 'success') {
        setPage(response.data);
        setPageConnected(true);
      }
    })();

  }, []);

  useEffect(() => {
    // Connect to the socket
    socket.auth = { token: Cookies.get('token') };
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to the server');
      // console.log(socket);
      
      
      socket.on('private_message', (data) => {
        console.log('Message received: ', data);
        setNotifyNewMessage(true);
      });
    });
    
    return () => {
      // Disconnect from the socket
      socket.disconnect();
    }
  }, []);

  return (
    <div className="flex flex-col items-center h-screen">
      <header className="bg-blue-400 w-full h-[10vh] px-2 flex flex-row justify-between items-center">
        <span className="font-black text-2xl py-3">Socialistic</span>
        <DropdownMenu username={username} />
      </header>
      <main className="flex flex-row w-full h-[90vh]">
        <section className="w-[350px] bg-purple-400 p-2 flex flex-col gap-2">
          {
            // If a page is connected, show page name instead of the button
            (pageConnected) ? (
              <p className="p-3 rounded-md bg-purple-900 text-white">{page.name || 'Page name'}</p>
            ) : (
            <PageSubscribeDialog
              pageConnected={pageConnected}
              setPageConnected={setPageConnected}
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
        <section className="bg-pink-400 w-full p-2">
          {
            // If no page is connected, show the message
            !pageConnected ? (
              <div className="flex flex-col gap-3 items-center justify-center h-full">
                <p className="text-white text-2xl font-black">
                  Connect a page to get started
                </p>
                <PageSubscribeDialog
                  pageConnected={pageConnected}
                  setPageConnected={setPageConnected}
                />
              </div>
            ) : (
              // If a page is connected, show the chat box
              recipient && (
                <ChatArea
                  // page={page}
                  recipient={recipient}
                />
              )
            )
          }
        </section>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
