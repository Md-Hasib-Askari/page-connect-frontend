import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { verifyUser } from '@/api/fetchAPI';
import { Spinner } from './ui/spinner';
import { useToast } from './ui/use-toast';
import { TOKEN_KEY } from '@/lib/constants';

const PrivateRoute = (Component: React.FC): React.FC => {
  return (props) => {
    const [loading, setLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
      const jwtToken = Cookies.get(TOKEN_KEY) as string; // Get token from cookie
      
      (async () => {
        // Verify the user with the token
        const response = await verifyUser(jwtToken);

        if (response.status === 'success') {
          setIsAuthenticated(true);
        }
        setLoading(false);
      })();
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
