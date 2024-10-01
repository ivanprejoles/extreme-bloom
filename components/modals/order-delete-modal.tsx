import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Form } from "../ui/form"
import { useEffect} from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useOrderDeleteModal } from "@/hooks/use-order-delete"

const formSchema = z.object({
    id: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
})

export function DeleteOrderModal() {
    const router = useRouter()
    const { toast } = useToast()
    const {
        isOpen,
        onClose,
        data
    } = useOrderDeleteModal()
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
            id: ''
        },
    })

    useEffect(() => {
      formReset()
    }, [data])

    const formReset = () => {
        form.setValue('id', data.id)
    }
      
      const isLoading = form.formState.isSubmitting

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (isLoading) return
        await axios.post('/api/deleteOrder', {id:values})
            .then(() => {
                toast({
                  title: "Order Deleted Successfully",
                    description: "Order deleted successfully.",
                })
                router.refresh()
            })
            .catch(() => {
                toast({
                    title: "Error Deleting Order",
                    description: "Please refresh your page to see the current categories and try again.",
                })
            })
            .finally(() => {
                handleClose()
            })
    }
        
    const handleClose = () => {
        onClose()
        form.reset()   
    }
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='w-full max-w-[90vw] md:max-w-[80vw] h-auto shadow-lg'>
          <DialogHeader>
              <DialogTitle className="text-red-500">{`Warning: Deleting ${data.name} Order`}</DialogTitle>
              <DialogDescription>
                  {`This action will permanently delete ${data.name} order.`}
              </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 space-x-4">
              <Button 
                variant='outline' 
                onClick={handleClose} 
                type="button"
                disabled={isLoading}
              >
                Close
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                variant='destructive'
              >
                Delete
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
}