import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { useProductsAddModal } from "@/hooks/admin/storage-update/use-products-add-modal"
import { FileUploader } from "../ui/file-uploader"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "@/firebase/firebase"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { debounce } from 'lodash'; // You can use a debounce utility like lodash or write your own.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useProductTable } from "@/hooks/admin/storage/use-product-storage"
import { useRouter } from 'next/navigation'


export function ProductsAddModal() {
    const [itemImage, setItemImage] = useState<Array<{imageSrc: File, title: string, price: number, quantity: number, description: string, categoryId: string}>>([]);
    const [removeIndex, setRemoveIndex] = useState<number | null | 'all'>(null);
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { isOpen, onClose } = useProductsAddModal()
    const {category} = useProductTable()

    const listCategory = Object.values(category)

    const handleClose = () => {
        onClose()
    }

    const handleFileUpload = (files: File[]) => {
        if (files.length <= 0 || files.length <= 5) {
            toast({
                title: 'Error Uploading Files',
                description: 'Please upload up to 5 files only. Each file must not exceed 2MB in size.'
            });
        }

        const newFiles = files.map((file) => ({
            imageSrc: file,
            title: '',
            description: '',
            categoryId: listCategory[0].id,
            price: 0,
            quantity: 0
        }));
        
        setItemImage(prev => [...prev, ...newFiles]); 
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedBlur = useCallback(
        debounce((index: number, field: string, value: string | number) => {
            setItemImage((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[index] = { ...updatedItems[index], [field]: value };
                return updatedItems;
            });
        }, 300), []
    );

    const handleBlur = (index: number, field: string, value: string | number) => {
        debouncedBlur(index, field, value);
    };
    
    const handleDelete = (index: number) => {
        const updatedItems = itemImage.filter((_, i) => i !== index);
        setItemImage(updatedItems);
        setRemoveIndex(index);
    };

    const uploadFileResumable = (file: File, name: string): Promise<{ downloadURL: string, name: string }> => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                }, 
                (error) => {
                    console.error(`Upload failed for ${name}:`, error);
                    reject(error);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => resolve({ downloadURL, name }))
                        .catch((error) => reject(error));
                }
            );
        });
    };

    const onSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);
    
        const uploadPromises = itemImage.map(async (fileObj) => {
            const { imageSrc, title, price, quantity, categoryId, description } = fileObj;
    
            try {
                const { downloadURL } = await uploadFileResumable(imageSrc, title);
                return { imageSrc: downloadURL, title, price, quantity, categoryId, description };
            } catch (error) {
                console.error(`Error uploading file ${title}:`, error); // Changed `name` to `title`
                return null;
            }
        });
    
        try {
            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(result => result !== null);
    
            if (successfulUploads.length === 0) {
                toast({
                    title: "No Products Uploaded",
                    description: "Please ensure that at least one product is valid.",
                });
                setIsLoading(false); // Stop loading if no products were uploaded
                return; // Early return
            }
    
            await axios.post('/api/addProducts', { newProducts: successfulUploads });
            
            toast({
                title: "Product Added",
                description: "Product added successfully. Refresh your page."
            });
            
            router.refresh();
            
        } catch (error) {
            toast({
                title: "Error Adding Product",
                description: "Check your input data. Also, product title should be unique."
            });
            console.error('Error adding products:', error);
        } finally {
            setItemImage([]);  // Reset the item image
            setRemoveIndex('all');  // Remove all indices
            setIsLoading(false);  // Stop the loading state
        }
    };
    

    const onClear = () => {
        setRemoveIndex('all');
        setItemImage([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg pt-6 mt-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">Add Items</DialogTitle>
                    <DialogDescription>
                        Adding multiple image files is available by dragging into the upload area. Only image files are allowed for upload.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="px-3">
                    <div className="flex h-auto w-full flex-col bg-muted/40">
                        <FileUploader onChange={handleFileUpload} multiple removeIndex={removeIndex} onRemoveComplete={() => setRemoveIndex(null)} />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Image</span></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemImage.length > 0 && itemImage.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image alt="Product image" className="aspect-square rounded-md object-cover" height="64" src={URL.createObjectURL(item.imageSrc)} width="64" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Input type="text" placeholder="Product Name" defaultValue={item.title} onBlur={(e) => handleBlur(index, 'title', e.target.value)} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Input type="text" placeholder="Product Description" defaultValue={item.price} onBlur={(e) => handleBlur(index, 'description', e.target.value)} />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {/* <Input type="text" placeholder="Product Name" defaultValue={item.title} onBlur={(e) => handleBlur(index, 'title', e.target.value)} /> */}
                                            <Select defaultValue={listCategory[0].id} onValueChange={(value) => handleBlur(index, 'categoryId', value)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {listCategory.map((cat, index) => (
                                                        <SelectItem key={index} value={cat.id}>{cat.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Input type="number" placeholder="Price" defaultValue={item.price} onBlur={(e) => handleBlur(index, 'price', parseFloat(e.target.value))} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Input type="number" placeholder="Quantity" defaultValue={item.quantity} onBlur={(e) => handleBlur(index, 'quantity', parseInt(e.target.value, 10))} />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(index)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:space-x-0 mt-2">
                        <Button onClick={onClear} variant="outline" disabled={isLoading}>Clear</Button>
                        <Button onClick={onSubmit} disabled={isLoading}>Submit</Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
