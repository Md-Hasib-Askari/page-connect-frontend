import Image from 'next/image';

export default function Chat({
    children, isSender, time, sender, profileImage
}: {
    children: string,
    isSender?: boolean,
    time?: string,
    sender?: string,
    profileImage?: string
}) {
  return (
    <div className={`flex ${isSender?'flex-row-reverse pl-10':'flex-row pr-10'} gap-2`}>
      <span className="size-8 rounded-full  text-center">
        {
          profileImage && !isSender ? (
            <Image
              src={profileImage}
              alt={sender || "Profile Image"}
              className="rounded-full w-fit"
            />
          ) : (
            <span className="size-full inline-block rounded-full text-white place-content-center bg-black">
              {sender}
            </span>
          )
        }
      </span>
      <div className={`${isSender?'bg-blue-400':'bg-red-400'} p-3 rounded-xl`}>
        <p className={`text-sm mb-1`}>
          {children}
        </p>
        <p className={`text-[0.7rem] ${isSender?'text-right':''}`}>{time}</p>
      </div>
    </div>
  );
}
