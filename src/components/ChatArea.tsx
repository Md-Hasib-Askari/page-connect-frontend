import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import ChatBox from "./ChatBox";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { socket } from "@/lib/socket";
import { fetchMessages } from "@/api/fetchAPI";

export const ChatArea = ({ recipient }: { recipient: string }) => {
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] = useState({
    user: {
      id: "",
      name: "",
      profile_image: {
        url: "",
        width: 0,
        height: 0,
      },
    },
    messages: [],
  });
  const [user, setUser] = useState({
    id: "",
    name: "",
    profile_image: {
      url: "",
      width: 0,
      height: 0,
    },
  });

  useEffect(() => {
    // jwt token
    const jwtToken = Cookies.get("token") as string;

    // fetch Messages
    (async () => {
      const response = await fetchMessages(jwtToken);
      if (response.status === "success") {
        const items = response.data.filter((message: any) => {
          if (message.user.id !== recipient) return;
          return message;
        });
        console.log(items[0]);
        
        setConversation(items[0]);
        setUser(items[0].user);
      }
    })();
  }, [recipient]);

  useEffect(() => {
    console.log("Conversation updated: ", user);
  }, [conversation]);

  const sendMessage = () => {
    socket.emit("private_message", {
      token: Cookies.get("token"),
      message: message,
      recipient: recipient,
    });
    setMessage("");
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          {/* {
            user && (
              <img
                className="rounded-full w-fit"
                src={user.profile_image.url}
                alt={user.name}
                height={user.profile_image.height}
                width={user.profile_image.width}
              />
            )
          } */}
          {conversation.user.name}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="h-full">
        <ChatBox messages={conversation.messages} recipient={recipient} />
      </CardContent>
      <CardFooter className="py-1 w-full flex flex-row justify-center">
        <div className="max-w-xl flex flex-row">
          <Input
            className="border-purple-900 ring-0 focus-visible:ring-0 mr-2 w-[400px]"
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
