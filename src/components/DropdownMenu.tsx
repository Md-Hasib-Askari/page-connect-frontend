import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa6';
import { TOKEN_KEY } from '@/lib/constants';
import { logout } from '@/api/fetchAPI';

export const Dropdown = ({username}: {username: string}) => {
    const router = useRouter();

    const handleLogout = async () => {
        const jwtToken = sessionStorage.getItem(TOKEN_KEY) as string;
        sessionStorage.clear();
        router.push('/');
        try {
          await logout(jwtToken)
        } catch (error) {
          console.error('Failed to logout');
        }
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button><FaUser className="mr-2"/>{username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-700 font-semibold">
            <span onClick={handleLogout}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
