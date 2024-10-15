import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useEffect} from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useCategoryDeleteModal } from "@/hooks/use-category-delete-modal"
import { useAccountUpdateModal } from "@/hooks/use-account-update"
import { Input } from "../ui/input"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    id: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    facebook: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    number: z.string().regex(phoneRegex, {message: 'Invalid phone number'}),
})

export function UpdateAccountModal() {
    const router = useRouter()
    const { toast } = useToast()
    const {
        isOpen,
        onClose,
        data
    } = useAccountUpdateModal()
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
            id: '',
            email: '',
            facebook: '',
            number: '',
        },
    })

    
    useEffect(() => {
        formReset()
    }, [data])
    
    const formReset = () => {
        form.reset()
        form.setValue('id', data.id||'')
        form.setValue('email', data.email||'')
        form.setValue('facebook', data.facebook||'')
        form.setValue('number', data.number||'')
    }
      const isLoading = form.formState.isSubmitting

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (isLoading) return
        try {
            await axios.post('/api/editAccount', values);
            
            toast({
                title: "Account Edited Successfully",
                description: "Account edited successfully. Please refresh your page."
            });
            
            router.refresh();
            } catch (error) {
            toast({
                title: "Error Editing Account",
                description: "Please refresh your page to see the current account information and try again."
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
        <DialogContent className="w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg pt-6 mt-8">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold">Update Account</DialogTitle>
                <DialogDescription>
                    Providing your account information helps us contact you.
                </DialogDescription>
            </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" disabled type="email" {...field} />
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Facebook Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Facebook" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Account Number" type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <Button 
                                type="button" 
                                onClick={formReset}
                                variant='outline'
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
        </DialogContent>
    </Dialog>
    )
}