'use client';
import { ReactElement, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { fbInit, FBLogin } from '@/lib/facebookAPI';
import { FaFacebook } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';

const FacebookConnectButton = ({ className = '' }: {className: string}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fbInit(); // Initializing Facebook API connection
    setLoading(false);
  }, []);

  const handleConnect = () => {
    FBLogin().then((status: boolean) => {
      if (status) {
        console.log('Logged in successfully');
        router.replace('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to login with Facebook',
          variant: 'destructive',
        });
      }
    });
  };

  return (
  <>
    <Button
      disabled={loading}
      className={`relative bg-purple-600 ${className}`} 
      onClick={handleConnect}>
        
        <FaFacebook size={20} className="mr-3" />
        Connect with Facebook
    </Button>
  </>
  );
};

export default FacebookConnectButton;
