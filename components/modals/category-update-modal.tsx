import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useProductUpdateModal } from "@/hooks/admin/storage-update/use-product-update-modal"
import { ScrollArea } from "../ui/scroll-area"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useEffect} from "react"
import { useToast } from "@/hooks/use-toast"
import { useCategoryUpdateModal } from "@/hooks/use-category-update-modal"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    id: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
})

export function UpdateCategoryModal() {
    const router = useRouter()
    const { toast } = useToast()
    const {
        isOpen,
        onClose,
        data
    } = useCategoryUpdateModal()
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
            title: '',
            id: ''
        },
    })

    useEffect(() => {
      formReset()
    }, [data])

    const formReset = () => {
        form.setValue('title', data.title)
        form.setValue('id', data.id)
    }
      
    const isLoading = form.formState.isSubmitting
    const handleClose = () => {
        onClose()
        form.reset()   
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (isLoading) return
        try {
          await axios.patch('/api/updateCategory', values)
          toast({
            title: "Category Updated Successfully",
            description: "Category updated successfully. Please refresh your page.",
          })
          router.refresh()
          handleClose()
        } catch (error) {
          toast({
            title: "Error Updating Category",
            description: "Please refresh your page to see the current categories and try again.",
          })          
          handleClose()
        }
    }
        
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='w-full max-w-[90vw] md:max-w-[80vw] h-auto shadow-lg'>
          <DialogHeader>
              <DialogTitle>Update Category</DialogTitle>
              <DialogDescription>
                  This action will permanently update your category.
              </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <Button 
                variant='outline' 
                onClick={formReset} 
                type="button"
                disabled={isLoading}
              >
                Clear
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
}