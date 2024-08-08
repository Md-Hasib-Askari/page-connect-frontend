import * as React from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { useEffect } from "react";
import { fetchMessages } from "@/api/fetchAPI";
import Spinner from "./ui/spinner";
import Image from "next/image";

export function ChatRecipientList({
  pageConnected,
  page,
  newMessage,
  callback,
  setRecipient,
}: {
  pageConnected?: boolean;
  page: any;
  newMessage: boolean;
  callback: (arg: boolean) => void;
  setRecipient: (arg: string) => void;
}) {
  const [messageItems, setMessageItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // jwt token
    const jwtToken = Cookies.get("token") as string;

    // fetch Messages
    (async () => {
      const response = await fetchMessages(jwtToken);

      console.log(response);
      
      if (response.status === "success" ) {
        let items = response.data.map((message: any) => {
          // time conversion to hours, days, weeks
          const currentTime = new Date().getTime();
          const lastMessageTime = new Date(
            message.lastMessage.createdTime
          ).getTime();
          const time = (currentTime - lastMessageTime) / (1000 * 3600);
          if (time * 60 < 1) {
            message.lastMessage.createdTime = "now";
          } else if (time < 1) {
            message.lastMessage.createdTime = `${Math.floor(time * 60)}m`;
          } else if (time < 24) {
            message.lastMessage.createdTime = `${Math.floor(time)}h`;
          } else if (time < 168) {
            message.lastMessage.createdTime = `${Math.floor(time / 24)}d`;
          } else {
            message.lastMessage.createdTime = `${Math.floor(time / 168)}w`;
          }

          return {
            id: message.recipient.id,
            name: message.recipient.name,
            profile_image: {
              url: message.recipient.profileImage,
            },
            message: message.lastMessage.message,
            time: message.lastMessage.createdTime,
            createdTime: lastMessageTime,
          };
        });
        // sort recipients by last message time
        items = items.sort((a: any, b: any) => {
          return (
            new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
          );
        });

        setMessageItems(items);
        callback(false);

        if (items.length > 0) {
          setLoading(false);
        }
      }
    })();
  }, [page, newMessage, callback]);

  const handleRecipient = (id: string) => {
    setRecipient(id);
  };
  return (
    <div className="w-full bg-white rounded-md">
      <Card className="">
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
        </CardHeader>
        <Separator />
        {
          (messageItems.length < 1) ? (
            <CardContent className="px-2 h-[69vh] scroll-auto overflow-y-auto w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg text-gray-500">No messages yet.</p>
              </div>
            </CardContent>) : (
              (loading) && (
                <CardContent className="px-2 h-[69vh] scroll-auto overflow-y-auto w-full">
                  <div className="relative flex flex-col items-center justify-center h-full">
                      <Spinner loading />
                  </div>
                </CardContent>
              )
            ) 
        }
        
        {pageConnected && messageItems ? (
          <CardContent className={`${loading ? 'hidden': ''} px-2 h-[69vh] scroll-auto overflow-y-auto w-full`}>
            {messageItems.map((item, index) => (
              <div key={index} className="w-full">
                <Button
                  className="px-2 w-full h-16 bg-transparent flex flex-row justify-between items-center"
                  onClick={() => handleRecipient(item.id)}
                >
                  <div className="size-10 rounded-full content-center">
                    <Image
                      className="rounded-full w-fit"
                      src={item.profile_image.url}
                      alt={item.name}
                    />
                  </div>
                  <div className="pl-2 py-3 grow text-left">
                    <p className="text-sm font-bold text-black">{item.name}</p>
                    <p className="text-xs text-gray-500">{`${item.message.slice(
                      0,
                      20
                    )}`}</p>
                  </div>
                  <div className="text-gray-700 text-xs text-right">
                    {item.time}
                  </div>
                </Button>
                <Separator />
              </div>
            ))}
          </CardContent>
        ) : (
          <CardContent className="px-2 h-[71vh] scroll-auto overflow-y-auto w-full">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg text-gray-500">
                Connect a Facebook page first.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
