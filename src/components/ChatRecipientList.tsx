import * as React from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { useEffect } from "react";
import { fetchMessages } from "@/api/fetchAPI";

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
  const [messageItems, setMessageItems] = React.useState([]);

  useEffect(() => {
    // jwt token
    const jwtToken = Cookies.get("token") as string;

    // fetch Messages
    (async () => {
      const response = await fetchMessages(jwtToken);
      if (response.status === "success") {
        const items = response.data.map((message: any) => {
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
            id: message.user.id,
            name: message.user.name,
            profile_image: {
              url: message.user.picture.url,
              width: message.user.picture.width,
              height: message.user.picture.height,
            },
            message: message.lastMessage.message,
            time: message.lastMessage.createdTime,
          };
        });

        setMessageItems(items);
        callback(false);
      }
    })();
  }, [page, newMessage]);

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
        {pageConnected && messageItems ? (
          <CardContent className="px-2 h-[69vh] scroll-auto overflow-y-auto w-full">
            {messageItems.map((item, index) => (
              <div key={index} className="w-full">
                <Button
                  className="px-2 w-full h-16 bg-transparent flex flex-row justify-between items-center"
                  onClick={() => handleRecipient(item.id)}
                >
                  <div className="size-10 rounded-full content-center">
                    <img
                        className="rounded-full w-fit"
                      src={item.profile_image.url}
                      alt={item.name}
                      height={item.profile_image.height}
                      width={item.profile_image.width}
                    />
                  </div>
                  <div className="pl-2 py-3 grow text-left">
                    <p className="text-sm font-bold text-black">{item.name}</p>
                    <p className="text-xs text-gray-500">{`${item.message.slice(
                      0,
                      20
                    )}...`}</p>
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
