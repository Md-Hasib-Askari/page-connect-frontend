import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getPages, savePage } from '@/api/fetchAPI';
import { useState } from 'react';
import { TOKEN_KEY } from '@/lib/constants';
import { Spinner } from './ui/spinner';
import { useToast } from './ui/use-toast';

export const PageSubscribeDialog = ({
  setPageConnected,
  setNotifyNewMessage,
}: {
  // eslint-disable-next-line no-unused-vars
  setPageConnected: (value: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setNotifyNewMessage: (value: boolean) => void
}) => {
  const [pageList, setPageList] = useState([]);
  const [jwtToken, setJwtToken] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // Get the list of pages
  const getPagesList = async () => {

    if (!isDialogOpen) {
      setIsDialogOpen(true);
    }
    
    setLoading(true); // Set the loading state to true

    // Get the JWT token from the cookie
    const jwtToken = (Cookies as any).get(TOKEN_KEY) as string;
    setJwtToken(jwtToken);
    
    const response = await getPages(jwtToken);
    console.log(response);
    
    
    if (response.status === 'success' && response.data) {
      setPageList(response.data);
    } else {
      toast({
        title: 'Error!',
        description: 'Error while fetching pages.',
        variant: 'destructive',
      });
    }
    setLoading(false); // Set the loading state to false
  };

  // Handle the page connect button click
  const handlePageConnect = async ({
    id,
    name,
    access_token,
  }: {
    id: string;
    name: string;
    access_token: string;
  }) => {
    setLoading(true); // Set the loading state to true

    // Save the page to the database
    const response = await savePage(jwtToken, id, access_token, name);
    
    if (response.status === 'success') {
      console.log('Page saved successfully');

      // trigger recipient list for new messages
      setNotifyNewMessage(true);
      
      setPageConnected(true);
      setIsDialogOpen(false);
      toast({
        title: 'Page connected',
        description: 'Page connected successfully',
        className: 'bg-green-600 text-green-100 ring-green-200',
      });
    } else {
      toast({
        title: 'Error!',
        description: 'The page couldn\'t be saved.',
        variant: 'destructive',
      });
      setLoading(false); // Set the loading state to false
    }

  };
  return (
    <Dialog 
      onOpenChange={setIsDialogOpen} 
      open={isDialogOpen}
      >
      <DialogTrigger asChild>
        <Button onClick={getPagesList}>Connect a Facebook Page</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] shadow-md'>
        <DialogHeader>
          <DialogTitle>Connect a page</DialogTitle>
          <DialogDescription>
            Connect to a Facebook page to receive updates in your chat
          </DialogDescription>
        </DialogHeader>

        {<Spinner loading={loading} />}

        <div className={`${loading ? 'hidden': ''}`}>
          <ul>
            {pageList.map((page, index) => (
              <li key={index} className="flex flex-row items-center justify-between py-2">
                <span><strong>{`${page['name']}`}</strong> {`(${page['id']})`}</span>
                <Button onClick={() => handlePageConnect(page)}>Connect</Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
