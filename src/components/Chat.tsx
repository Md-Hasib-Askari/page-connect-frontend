import Image from 'next/image';
import { FaUser } from 'react-icons/fa6';

export default function Chat({
    children, isSender, time, sender, profileImage,
}: {
    children: string,
    isSender?: boolean,
    time: string,
    sender?: string,
    profileImage?: string
}) {
  return (
    <div className={`flex ${isSender?'flex-row-reverse pl-10':'flex-row pr-10'} gap-2`}>
      <span className="size-8 rounded-full text-center">
        {
          profileImage && !isSender ? (
            <Image
              src={profileImage}
              alt={sender || 'Profile Image'}
              className="rounded-full size-full"
              height={25}
              width={25}
            />
          ) : (
            <span className="size-full flex justify-center items-center w-full rounded-full text-white bg-purple-950">
              <FaUser />
            </span>
          )
        }
      </span>
      <div className={`${isSender?'bg-purple-400 text-white':'bg-white'} p-3 rounded-xl shadow-md`}>
        <p className={'text-sm mb-1 select-text'}>
          {children}
        </p>
          <p className={`text-[0.6rem] ${isSender?'text-right text-gray-100':'text-gray-600'}`}>{new Date(time).toLocaleTimeString('en-US', {timeStyle: 'short'})}</p>
      </div>
    </div>
  );
}
