import { useEffect, useState, useRef } from "react";
import Chat from "./Chat";

export default function ChatBox({ 
  profileImage,
  messages, 
  recipient 
} : { 
  profileImage: string,
  messages: any[],
  recipient: string
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageItems, setMessageItems] = useState<any[]>([]);

  useEffect(() => {
    const items = messages;
    console.log(items);
    // time conversion to hours, days, weeks
    items.forEach((message) => {
      const lastMessageTime = new Date(message.createdTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      message.createdTime = lastMessageTime;
    });
    
    setMessageItems(items);

  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messageItems]);
  
  return (
    <div ref={containerRef} className="overflow-auto scroll-auto h-[66vh] w-full flex flex-col gap-3 text-justify">
      { messageItems &&
          messageItems.map((message: any, index: number) => (
            <Chat 
              key={index}
              isSender={message.sender.id !== recipient}
              time={message.createdTime}
              sender={message.sender.name[0]}
              profileImage={profileImage}
            >
              {message.message}
            </Chat>
          ))
      }
    </div>
  );
}
