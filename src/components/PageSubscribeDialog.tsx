import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPages, savePage } from '@/api/fetchAPI';
import { useState } from 'react';

export function PageSubscribeDialog({
  pageConnected,
  setPageConnected
}: {
  pageConnected: boolean,
  setPageConnected: (value: boolean) => void
}) {
  const [pageList, setPageList] = useState([]);
  const [jwtToken, setJwtToken] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get the list of pages
  const getPagesList = async () => {
    if (!isDialogOpen) {
      setIsDialogOpen(true);
    }
    const jwtToken = Cookies.get('token') as string;
    setJwtToken(jwtToken);
    
    const response = await getPages(jwtToken);
    if (response.status === 'success') {
      setPageList(response.data);
    }
  }

  // Handle the page connect button click
  const handlePageConnect = async ({
    id,
    name,
    access_token
  }: {
    id: string;
    name: string;
    access_token: string;
  }) => {
    // Save the page to the database
    const response = await savePage(jwtToken, id, access_token, name);

    if (response.status === 'success') {
      console.log('Page saved successfully');
      setPageConnected(true);
      setIsDialogOpen(false);
    }
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={getPagesList}>Connect a Facebook Page</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect a page</DialogTitle>
          <DialogDescription>
            Connect to a Facebook page to receive updates in your chat
          </DialogDescription>
        </DialogHeader>
        <div className="">
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
  )
}
