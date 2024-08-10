import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import ChatBox from './ChatBox';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/card';
import { socket } from '@/lib/socket';
import { fetchMessages } from '@/api/fetchAPI';
import Image from 'next/image';
import { TOKEN_KEY } from '@/lib/constants';
import { useToast } from './ui/use-toast';

export const ChatArea = ({ 
  recipient, newMessage,
 }: { 
  recipient: string, 
  newMessage: boolean
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState<string>(''); // message to be sent
  const [conversation, setConversation] = useState({
    recipient: {
      id: '',
      name: '',
      profileImage: '',
    },
    messages: [],
  });
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadMessages, setLoadMessages] = useState(false);

  useEffect(() => {
    // jwt token
    const jwtToken = (Cookies as any).get(TOKEN_KEY);

    // fetch Messages
    (async () => {
      const response = await fetchMessages(jwtToken);
      if (response.status === 'success') {
        const items = response.data.filter((message: any) => {
          if (message.recipient.id !== recipient) return;
          return message;
        });
        
        setConversation(items[0]);
        setProfileImage(items[0].recipient.profileImage);

        setLoading(false);
      } else {
        toast({
          title: 'Sorry!',
          description: 'Something is wrong!',
          variant: 'destructive',
        });
      }
    })();
    // eslint-disable-next-line
  }, [recipient, newMessage, loadMessages]);

  useEffect(() => {
    setLoading(true);
  }, [recipient]);

  const sendMessage = () => {
    
    socket.emit('private_message', {
      token: (Cookies as any).get(TOKEN_KEY),
      message: message,
      recipient: recipient,
    });
    setMessage('');
    setLoadMessages(!loadMessages);
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') sendMessage();
  };

  return (
    <Card className="h-full flex flex-col justify-between shadow-md bg-gradient-to-r from-purple-100 to-purple-50">
      <CardHeader className="pb-0">
        <CardTitle className="flex gap-3 align-middle">
          {!loading && (
            <>
              <Image
                src={profileImage}
                alt={conversation.recipient.name}
                className="size-8 rounded-full mr-2"
                height={20}
                width={20}
              />
              <span className="content-center">{conversation.recipient.name}</span>
            </>
          )}
        </CardTitle>
        <Separator className="bg-gradient-to-r from-purple-200 bg-purple-100" />
      </CardHeader>
      {loading ? (
        <CardContent>
          <div className="relative flex justify-center place-items-center">
            <Spinner loading={loading} />
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full pt-2'>
          <ChatBox
            profileImage={profileImage}
            messages={conversation.messages}
            recipient={recipient}
          />
        </CardContent>
      )}
      <CardFooter className="py-1 w-full flex flex-row justify-center">
        <div className="max-w-xl flex flex-row">
          <Input
            onKeyDown={handleEnterPress}
            className="border-purple-900 border-2 ring-0 focus-visible:ring-0 mr-2 md:w-[400px]"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button className="bg-purple-900 text-white" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
