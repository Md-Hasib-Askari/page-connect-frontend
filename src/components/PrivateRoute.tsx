import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext'; // Update the path to your actual AuthContext

const PrivateRoute = <P extends object>(Component: React.FC<P>): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>; // Show a loading spinner or placeholder while checking auth
    }

    if (!isAuthenticated) {
      router.replace('/'); // Redirect to home if not authenticated
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuth;
};

export default PrivateRoute;
