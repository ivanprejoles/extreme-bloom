"use client"

import * as React from "react"
import { TrashIcon } from "@radix-ui/react-icons"
import useMediaQuery from "@/lib/media-query"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icons } from "@/components/general/icons"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  ordersId: string[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteOrderDialog({
  ordersId,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const { toast } = useToast()
  const router = useRouter()
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  function onDelete() {
    startDeleteTransition(async () => {
      try {
        await axios.delete('/api/deleteOrders', {
          data: { orders: ordersId}
        })
        props.onOpenChange?.(false)
        toast({
          title: 'Orders Deleted Successfully',
          description: 'Orders are deleted. Refresh your page'
        })
        onSuccess?.()        
        router.refresh()
      } catch (error) {
        console.error(`error: ${error}`)
        toast({
          title: 'Error Deleting Orders',
          description: 'Error deleting orders. Try again.'
        })
      }
    })
  }

  if (!isMounted) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete ({ordersId.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{ordersId.length}</span>
              {ordersId.length === 1 ? " order" : " orders"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({ordersId.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{ordersId.length}</span>
            {ordersId.length === 1 ? " order" : " orders"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}