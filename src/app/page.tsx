'use client';

import {verifyUser} from '@/api/fetchAPI';
import FacebookConnectButton from '@/components/FacebookConnectButton';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {TOKEN_KEY} from '@/lib/constants';
import { fbInit, FBLogin } from '@/lib/facebookAPI';
import { FaCircleInfo, FaInfo } from 'react-icons/fa6';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const error = searchParams.get('error') as string | null;
    fbInit(error).then((status) => {
      if (status) {
        router.replace('/dashboard');
        return;
      } else {
        FBLogin().then((status) => {
          if (status) {
            router.replace('/dashboard');
            return;
          } else {
            toast({
              title: 'Login Error!',
              description: 'SORRY! Unable to login with Facebook',
              variant: 'destructive',
            });
            setLoading(false);
          }
        });
      }
    });
    // Check if user is already logged in
    const jwtToken = sessionStorage.getItem(TOKEN_KEY) as string;
    
    if (jwtToken) {
      verifyUser(jwtToken).then((data) => {
        if (data.status === 'success') {
          console.log('User is verified');
          router.replace('/dashboard');
        }
      });
    }
    setLoading(false);
  }, []);

  return (
    <main className="md:relative w-full h-[100dvh] flex flex-col md:flex-row">
      <p className="md:absolute bg-black text-white w-[100dvw] text-center text-3xl py-5">
        Welcome to <span className="font-black">Socialistic</span>
      </p>
      <div className="flex-1 bg-blue-700 content-center">
        <Card className="border-none w-full bg-transparent text-white justify-center mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Let&apos;s get{' '}
              <span className="text-blue-300 font-black">Started</span>
            </CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Let&apos;s connect Facebook pages organized
            </CardDescription>
          </CardHeader>
          <CardContent className="justify-center">
            <div className="w-full flex justify-center">
              <FacebookConnectButton loading={loading} className="bg-white text-blue-800 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 bg-purple-600 content-center px-5">
        <Card className="border-none w-full bg-transparent text-white mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              How it <span className="text-purple-400 font-black">Works?</span>
            </CardTitle>
            <CardDescription className="text-purple-100 text-center">
              Learn more about the mechanism of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button className="bg-purple-100 text-purple-700">
                <FaCircleInfo size={20} className='mr-2' />
                <span>Learn More</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="md:absolute bottom-0 text-xs py-3 text-gray-300 text-center w-full bg-black">
        All rights reserved &copy; 2024
      </p>
    </main>
  );
}
