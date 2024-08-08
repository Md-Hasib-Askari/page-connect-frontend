'use client'
import { ReactElement, useEffect } from "react";
import { Button } from "./ui/button";
import { fbInit, FBLogin } from "@/lib/facebookAPI";
import { FaFacebook } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const FacebookConnectButton = ({ className = '' }: {className: string}): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    fbInit(); // Initializing Facebook API connection
  }, []);

  const handleConnect = () => {
    FBLogin().then((status) => {
      if (status) {
        console.log('Logged in successfully');
        router.push('/dashboard');
      } else {
        console.log('Failed to login');
      }
    });
  };

  return (
  <>
    <Button 
      className={`relative bg-purple-600 ${className}`} 
      onClick={handleConnect}>
        
        <FaFacebook size={20} className="mr-3" />
        Connect with Facebook
    </Button>
  </>
  );
};

export default FacebookConnectButton;
