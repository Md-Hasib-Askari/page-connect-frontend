import { useEffect, useState, useRef } from 'react';
import Chat from './Chat';

export default function ChatBox({ 
  profileImage,
  messages, 
  recipient, 
} : { 
  profileImage: string,
  messages: any[],
  recipient: string
}) {
  // eslint-disable-next-line
  const containerRef = useRef<HTMLDivElement>(null as any);
  const [messageItems, setMessageItems] = useState<any[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<any[]>([]);

  useEffect(() => {
    // sort items according to time
    const items = messages.sort((a: any, b: any) => {
      a = new Date(a.createdTime).getTime();
      b = new Date(b.createdTime).getTime();
      return a-b;
    });

    // group items by date
    const groupedItems: any[] = [];
    let currentGroup: any[] = [];
    let currentDate: string = '';
    items.forEach((item: any) => {
      const date = new Date(item.createdTime).toDateString();
      if (date !== currentDate) {
        if (currentGroup.length > 0) {
          groupedItems.push(currentGroup);
        }
        currentGroup = [];
        currentDate = date;
      }
      currentGroup.push(item);
    });
    if (currentGroup.length > 0) {
      groupedItems.push(currentGroup);
    }
    setGroupedMessages(groupedItems);    
    setMessageItems(items);
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messageItems]);
  
  return (
    <div ref={containerRef} className="overflow-auto scroll-auto h-[66dvh] xl:max-w-4xl mx-auto flex flex-col gap-3 text-justify">
      {
        groupedMessages.map((group: any, index: number) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="text-center text-sm text-gray-500">
              {new Date(group[0].createdTime).toLocaleDateString(
                'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </div>
            {
              group.map((message: any, index: number) => (
                <Chat 
                  key={index}
                  isSender={message.sender.id !== recipient}
                  time={message.createdTime}
                  sender={message.sender?.name ? message.sender?.name[0] : 'P'}
                  profileImage={profileImage}
                >
                  {message.message}
                </Chat>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}
