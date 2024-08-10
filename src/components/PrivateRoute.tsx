import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { verifyUser } from '@/api/fetchAPI';
import { Spinner } from './ui/spinner';
import { useToast } from './ui/use-toast';
import { TOKEN_KEY } from '@/lib/constants';

const PrivateRoute = (Component: React.FC): React.FC => {
  /* eslint-disable react/display-name */
  return (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState<boolean>(true);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { toast } = useToast();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const jwtToken = (Cookies as any).get(TOKEN_KEY) as string; // Get token from cookie
      if (!jwtToken) {
        router.replace('/');
        return;
      }
      
      (async () => {
        // Verify the user with the token
        const response = await verifyUser(jwtToken);

        if (response.status === 'success') {
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          toast({
            title: 'Unauthorized',
            description: 'You are not authorized to view this page',
            variant: 'destructive',
          });
          router.replace('/'); // Redirect to home if not authenticated
          return null;
        }
      })();
      // eslint-disable-next-line
    }, []);

    if (loading) {
      return <div className="flex flex-col w-full h-screen place-items-center">
        <Spinner loading />
      </div>; // Show a loading spinner or placeholder while checking auth
    }

    if (!isAuthenticated) {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to view this page',
        variant: 'destructive',
      });
      router.replace('/'); // Redirect to home if not authenticated
      return null;
    }

    return <Component {...props} />;
  };
};

export default PrivateRoute;
