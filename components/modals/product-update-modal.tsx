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
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useEffect, useMemo, useState } from "react"
import {storage} from '@/firebase/firebase'
import { FileUploader } from "@/components/ui/file-uploader"
import { deleteObject, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import { useProductTable } from "@/hooks/admin/storage/use-product-storage"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { AspectRatio } from "../ui/aspect-ratio"

const formSchema = z.object({
    id: z.string().min(2, {
        message: 'Product is not valid.'
    }),
    title: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    categoryId: z.string().min(2, {
        message: 'Product image is needed.'
    }),
    imageSrc: z.string().min(2, {
        message: 'Product image is needed.'
    }),
    quantity: z.coerce.number().gte(1, {
        message: 'There should be an item'
    }),
    price: z.coerce.number().gte(1, {
        message: 'Price value is not allowed'
    })
})

export function UpdateProductModal() {
    const [currentImage, setCurrentImage] = useState('')
    const [newImage, setNewImage] = useState<File>();
    const { toast } = useToast()
    const {
        isOpen,
        onClose,
        data
    } = useProductUpdateModal()
    
    const {
        category,
        onAddProduct
    } = useProductTable()

    const handleClose = () => {
        setNewImage(undefined)
        onClose()
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: '',
            title: '',
            description: '',
            categoryId: '',
            imageSrc: '',
            quantity: 0,
            price: 0,
        },
    })

    useEffect(() => {
        formReset()
    }, [data])

    const formReset = () => {
        form.setValue('id', data.id)
        form.setValue('title', data.title)
        form.setValue('imageSrc', data.imageSrc)
        form.setValue('description', data.description)
        form.setValue('categoryId', data.categoryId)
        form.setValue('price', data.price)
        form.setValue('quantity', data.quantity)
        setCurrentImage(data.imageSrc)
    }

    const imageUrl = useMemo(() => {
        if (newImage) {
          return URL.createObjectURL(newImage);
        }
        return undefined;
    }, [newImage]);

    const isLoading = form.formState.isSubmitting

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isLoading) return
        
        if (newImage) {
            const date = new Date();
            const dateString = date.toISOString().replace(/[-:.T]/g, '');
            const storageRef = ref(storage, `${dateString}-${newImage.name.split('.').pop()}`)
            const uploadTask = uploadBytesResumable(storageRef, newImage);

            try {
                const downloadURL = await new Promise<string>((resolve, reject) => {
                    uploadTask.on(
                      'state_changed',
                      (snapshot: UploadTaskSnapshot) => {
                        // Monitor progress
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                      },
                      (error) => {
                        reject(new Error('Something went wrong uploading the new image.'));
                      },
                      async () => {
                        try {
                          const url = await getDownloadURL(uploadTask.snapshot.ref);
                          resolve(url);
                        } catch (error) {
                          reject(new Error('Failed to retrieve download URL.'));
                        }
                      }
                    );
                });
    
                values.imageSrc = downloadURL
                const filePath = decodeURIComponent(currentImage.split('/o/')[1].split('?')[0])
                const desertRef = ref(storage, filePath);

                deleteObject(desertRef)
                    .then(() => {
                        toast({
                            title: `Previous Image Updated`,
                            description: 'Previous image updated successfully.',
                        })
                    })
                    .catch((error) => {
                        toast({
                            title: `Error Updating Image`,
                            description: 'Something went wrong deleting image.',
                        })
                    });
            } catch (error) {
                toast({
                    title: `Error Uploading Image`,
                    description: 'Something went wrong uploading image. make sure the image size is not too large.',
                })
            }

        }
        
        await axios.patch('/api/updateProduct', values)
            .then((response) => {
                toast({
                    title: "Product Updated",
                    description: "Product updated successfully.",
                })
                onAddProduct([response.data])
            })
            .catch((error) => {
                console.error('error: ', error)
                toast({
                    title: "Error Updating Product",
                    description: "Please check your network and try again.",
                })
            })
            .finally(() => {
                handleClose()
            })
    }

    const handleFileUpload = (files: File[]) => {
        setNewImage(files[0])
    };

    const onClearForm = () => {
        form.reset()
        formReset()
        setNewImage(undefined)
    }
        
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg mt-8'>
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                    <DialogDescription>
                        This action will permanently update your product information.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="px-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2">

                            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pr-4 mt-6">
                                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                                    <div className="mx-auto grid max-w-full flex-1 auto-rows-max gap-4">
                                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                            <Card x-chunk="dashboard-07-chunk-0">
                                                <CardHeader>
                                                    <CardTitle>Product Details</CardTitle>
                                                    <CardDescription>
                                                        Update your current product by submitting.
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid gap-6">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name">Name</Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="title"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input disabled={isLoading} type='text' placeholder="Product Title" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="description">Description</Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="description"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Tell us about your product size and description."
                                                                            className="resize-none"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card x-chunk="dashboard-07-chunk-1">
                                                <CardHeader>
                                                    <CardTitle>Stock</CardTitle>
                                                    <CardDescription>
                                                        Your current product
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                            <TableHead>Stock</TableHead>
                                                            <TableHead>Price (₱)</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Label htmlFor="stock-1" className="sr-only">
                                                                    Stock
                                                                    </Label>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="quantity"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input disabled={isLoading} type='number' placeholder="Quantity" min={0} {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Label htmlFor="price-1" className="sr-only">
                                                                        Price
                                                                    </Label>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="price"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input disabled={isLoading} type='number' placeholder="Price" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                            <Card x-chunk="dashboard-07-chunk-3">
                                                <CardHeader>
                                                    <CardTitle>Product Category</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid gap-6">
                                                            <Label htmlFor="status">Category</Label>
                                                            <FormField
                                                                control={form.control}
                                                                name="categoryId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Select onValueChange={field.onChange} defaultValue={form.getValues('categoryId')}>
                                                                            <SelectTrigger id="status" aria-label="Select category">
                                                                                <SelectValue placeholder="Select Category" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {category && (
                                                                                    Object.values(category).map((cat, key) => (
                                                                                        <SelectItem key={key} value={cat.id}>
                                                                                            {cat.title}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card
                                                className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                                            >
                                                <CardHeader>
                                                    <CardTitle>Product Images</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid gap-2">
                                                        <div className="w-full h-full">
                                                            <AspectRatio ratio={4/3} className="bg-muted">
                                                                <Image
                                                                    alt="Product image"
                                                                    fill
                                                                    className="h-full w-full rounded-md object-cover"
                                                                    src={(imageUrl) ? imageUrl : currentImage}
                                                                />
                                                            </AspectRatio>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {/* <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"> */}
                                                            <FileUploader onChange={handleFileUpload} />
                                                            {/* <span className="sr-only">Upload</span>
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card x-chunk="dashboard-07-chunk-3">
                                            <CardHeader>
                                                <CardTitle>Submit Area</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-3 items-center justify-end">
                                                    <Button
                                                        disabled={isLoading} 
                                                        type="button" 
                                                        onClick={onClearForm} 
                                                        variant='outline'
                                                        size="sm"
                                                    >
                                                        Reset Product
                                                    </Button>
                                                    <Button 
                                                        disabled={isLoading} 
                                                        size="sm"
                                                    >
                                                        Update Product
                                                    </Button>
                                                </div>
                                            </CardContent>
                                            </Card>
                                        </div>
                                        </div>
                                    </div>
                                    </main>
                                </div>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}