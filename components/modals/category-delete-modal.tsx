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
import { useCategoryDeleteModal } from "@/hooks/use-category-delete-modal"

const formSchema = z.object({
    id: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
})

export function DeleteCategoryModal() {
    const router = useRouter()
    const { toast } = useToast()
    const {
        isOpen,
        onClose,
        data
    } = useCategoryDeleteModal()
    
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
      try {
        await axios.delete('/api/deleteCategory', { data: values });
        
        toast({
          title: "Category Deleted Successfully",
          description: "Category deleted successfully. Please refresh your page."
        });
        
        router.refresh();
      } catch (error) {
        toast({
          title: "Error Deleting Category",
          description: "Please refresh your page to see the current categories and try again."
        });
        
        console.error('error: ', error);
      } finally {
        handleClose();
      }     
    }
        
    const handleClose = () => {
        onClose()
        form.reset()   
    }
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='w-full max-w-[90vw] md:max-w-[80vw] h-auto shadow-lg'>
          <DialogHeader>
              <DialogTitle className="text-red-500">{`Warning: Deleting ${data.title} Category`}</DialogTitle>
              <DialogDescription>
                  {`This action will permanently delete your ${data.title} category and its products.`}
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