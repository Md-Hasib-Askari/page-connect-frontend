import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa6";

export const Dropdown = ({username}: {username: string}) => {
    const router = useRouter();

    const logout = () => {
        Cookies.remove('token');
        router.push('/');
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button><FaUser className="mr-2"/>{username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-700 font-semibold">
            <span onClick={logout}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
