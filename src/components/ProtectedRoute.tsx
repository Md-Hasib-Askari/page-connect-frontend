import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyUser } from "@/api/fetchAPI";

export default (Component: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      const jwtToken = Cookies.get('token');
      if (jwtToken) {
        verifyUser(jwtToken).then((data) => {
          if (data.status === 'success') {
            setIsAuthenticated(true);
          } else {
            router.replace('/');
          }
        });
      } else {
        router.replace('/');
      }
    }, []);

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
};