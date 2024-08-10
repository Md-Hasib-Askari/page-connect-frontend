'use client';

import Cookies from 'js-cookie';
import {verifyUser} from '@/api/fetchAPI';
import FacebookConnectButton from '@/components/FacebookConnectButton';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {TOKEN_KEY} from '@/lib/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const jwtToken = (Cookies as any).get(TOKEN_KEY);
    if (jwtToken) {
      verifyUser(jwtToken).then((data) => {
        if (data.status === 'success') {
          console.log('User is verified');
          router.replace('/dashboard');
        }
      });
    }
  }, []);

  return (
    <main className="w-full h-screen flex">
      <p className="absolute bg-black text-white w-full text-center  text-3xl py-5">
        Welcome to <span className="font-black">Socialistic</span>
      </p>
      <div className="flex-1 bg-blue-700 content-center">
        <Card className="border-none w-[400px] bg-transparent text-white justify-center mx-auto">
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
              <FacebookConnectButton className="bg-white text-blue-800 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 bg-purple-600 content-center px-5">
        <Card className="border-none w-[400px] bg-transparent text-white mx-auto">
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
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="absolute bottom-0 text-xs py-3 text-gray-300 text-center w-full bg-black">
        All rights reserved &copy; 2024
      </p>
    </main>
  );
}
