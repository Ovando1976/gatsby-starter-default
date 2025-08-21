import React from "react";
import { Link, navigate } from "gatsby"
import { toast } from "react-hot-toast"
import { cn, formatDate } from "../../lib/utils"

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { IconShare, IconSpinner, IconTrash, IconUsers } from "./ui/icons"
import { badgeVariants } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip"

// A small sub-component for your delete confirmation dialog
const DeleteAlertDialog = ({
  isRemovePending,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onDeleteConfirm,
}) => (
  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete your chat message and remove your data
          from our servers.
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
)

export function SidebarActions({ chat, removeChat, shareChat }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  // React 18 concurrency hooks:
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  const [isSharePending, startShareTransition] = React.useTransition()

  // Instead of `useRouter()` from Next.js, use Gatsby's `navigate()`
  // for programmatic navigation (navigate("/"), etc.)

  // Copies the chat's share link to the clipboard
  const copyShareLink = React.useCallback(async (chatToShare) => {
    if (!chatToShare.sharePath) {
      toast.error("Could not copy share link to clipboard")
      return
    }

    const url = new URL(window.location.href)
    url.pathname = chatToShare.sharePath
    await navigator.clipboard.writeText(url.toString())

    setShareDialogOpen(false)
    toast.success("Share link copied to clipboard")
  }, [])

  // Called when the user confirms deletion
  const onDeleteConfirm = async () => {
    startRemoveTransition(async () => {
      const result = await removeChat({ id: chat.id, path: chat.path })
      if (result && "error" in result) {
        toast.error(result.error)
        return
      }

      setDeleteDialogOpen(false)
      // Instead of router.push("/")
      navigate("/")
      toast.success("Chat deleted")
    })
  }

  return (
    <TooltipProvider>
      <div className="space-x-1">
        {/* SHARE BUTTON */}
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

        {/* DELETE BUTTON */}
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

      {/* SHARE DIALOG */}
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
              // For a sharePath, consider whether it is an internal or external link:
              // If external, use a standard <a> with target="_blank"
              // If internal, use <Link to={chat.sharePath} />
              <a
                href={chat.sharePath}
                className={cn(badgeVariants({ variant: "secondary" }), "mr-auto")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconUsers className="mr-2" />
                {chat.sharePath}
              </a>
            )}
            <Button
              disabled={isSharePending}
              onClick={() => {
                startShareTransition(async () => {
                  // If there's already a sharePath, just copy it
                  if (chat.sharePath) {
                    // small delay for demonstration
                    await new Promise((resolve) => setTimeout(resolve, 500))
                    copyShareLink(chat)
                    return
                  }

                  // Otherwise, call shareChat to create a new share link
                  const result = await shareChat(chat)
                  if (result && "error" in result) {
                    toast.error(result.error)
                    return
                  }

                  // Then copy the new share link from the result
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

      {/* DELETE ALERT DIALOG */}
      <DeleteAlertDialog
        isRemovePending={isRemovePending}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDeleteConfirm={onDeleteConfirm}
      />
    </TooltipProvider>
  )
}

export default SidebarActions