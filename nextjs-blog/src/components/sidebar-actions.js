'use client'

import * as React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { cn, formatDate } from '../../lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {
    IconShare,
    IconSpinner,
    IconTrash,
    IconUsers,
} from './ui/icons';
import  Link  from 'next/link';
import { badgeVariants } from './ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from './ui/tooltip';


const DeleteAlertDialog = ({ isRemovePending, deleteDialogOpen, setDeleteDialogOpen, onDeleteConfirm }) => (
  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
          <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This will permanently delete your chat message and remove your data from our servers.
              </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemovePending}>
                  Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={isRemovePending} onClick={onDeleteConfirm}>
                  {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
                  Delete
              </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
);

export function SidebarActions({ chat, removeChat, shareChat }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
    const [isRemovePending, startRemoveTransition] = React.useTransition();
    const [isSharePending, startShareTransition] = React.useTransition();
    const router = useRouter();

    const copyShareLink = React.useCallback(async (chat) => {
    if (!chat.sharePath) {
      return toast.error('Could not copy share link to clipboard')
    }

    const url = new URL(window.location.href)
    url.pathname = chat.sharePath
    navigator.clipboard.writeText(url.toString())
    setShareDialogOpen(false)
    toast.success('Share link copied to clipboard', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '14px'
      },
      iconTheme: {
        primary: 'white',
        secondary: 'black'
      }
    })
  }, [])



const onDeleteConfirm = async () => {
  const result = await removeChat({ id: chat.id, path: chat.path });
  if (result && 'error' in result) {
      toast.error(result.error);
      return;
  }
  setDeleteDialogOpen(false);
  router.push('/');
  toast.success('Chat deleted');
};


  return (
    <>
    <TooltipProvider>
      <div className="space-x-1"> 
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-background"
              onClick={() => setShareDialogOpen(true)}
            >
              <IconShare />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share chat</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-background"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <IconTrash />
              <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete chat</TooltipContent>
        </Tooltip>
      </div>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link to chat</DialogTitle>
            <DialogDescription>
              Anyone with the URL will be able to view the shared chat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1 rounded-md border p-4 text-sm">
            <div className="font-medium">{chat.title}</div>
            <div className="text-muted-foreground">
              {formatDate(chat.createdAt)} · {chat.messages.length} messages
            </div>
          </div>
          <DialogFooter className="items-center">
            {chat.sharePath && (
              <Link
                href={chat.sharePath}
                className={cn(
                  badgeVariants({ variant: 'secondary' }),
                  'mr-auto'
                )}
                target="_blank"
              >
                <IconUsers className="mr-2" />
                {chat.sharePath}
              </Link>
            )}
            <Button
              disabled={isSharePending}
              onClick={() => {
                startShareTransition(async () => {
                  if (chat.sharePath) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    copyShareLink(chat)
                    return
                  }

                  const result = await shareChat(chat)

                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }

                  copyShareLink(result)
                })
              }}
            >
              {isSharePending ? (
                <>
                  <IconSpinner className="mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>Copy link</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This will permanently delete your chat message and remove your data from our servers.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction
                disabled={isRemovePending}
                onClick={event => {
                    event.preventDefault();
                    startRemoveTransition(async () => {
                        const result = await removeChat({
                            id: chat.id,
                            path: chat.path
                        });

                        if (result && 'error' in result) {
                            toast.error(result.error);
                            return;
                        }

                        setDeleteDialogOpen(false);
                        router.push('/');
                        toast.success('Chat deleted');
                    });
                }}
            >
                {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
                Delete
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>


<DeleteAlertDialog 
    isRemovePending={isRemovePending} 
    deleteDialogOpen={deleteDialogOpen} 
    setDeleteDialogOpen={setDeleteDialogOpen} 
    onDeleteConfirm={onDeleteConfirm}
  
/>
</TooltipProvider>
</>

)
}

export default SidebarActions;
