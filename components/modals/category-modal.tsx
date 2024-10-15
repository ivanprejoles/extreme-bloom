import random from 'random-name'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategoryModal } from '@/hooks/use-category-modal'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useRef, useState } from 'react'
import { useProductTable } from "@/hooks/admin/storage/use-product-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast, useToast } from '@/hooks/use-toast'
import { useCategoryUpdateModal } from '@/hooks/use-category-update-modal'
import { useCategoryDeleteModal } from '@/hooks/use-category-delete-modal'

const CategoryModal = () => {

    const {isOpen, onClose} = useCategoryModal()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const {
        category
    } = useProductTable()

    const {onOpen} = useCategoryUpdateModal()
    const {onDelete} = useCategoryDeleteModal()

    const categoryArray = Object.values(category)
    
    const handleClose = () => {
        onClose();
    }

    const addCategory = async () => {
        if (isLoading) return
        setIsLoading(true)

        const date = new Date()
        const seed = date.getTime();
        const randomSeed = Math.abs(Math.sin(seed)) * 10000;        
        const randomName = `${random.place()}_${Math.floor(randomSeed)}`;

        try {
            await axios.post('/api/createCategory', { category: randomName });
            
            toast({
                title: 'Category Created Successfully',
                description: 'New category created, refresh your page to see the current category.'
            });
            router.refresh()
        } catch (error) {
            toast({
                title: 'Error Creating Category',
                description: 'Something went wrong creating your category. Please try again later.'
            });
            
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Stop the loading state
        }
              
    }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg pt-6'>
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold">Category Table</DialogTitle>
                <DialogDescription>
                    Easily manage your product categories. Add new categories, edit existing ones, or delete those you no longer need to keep your product list organized and up to date.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="px-3">
                <div className="flex h-auto w-full flex-col bg-muted/40">
                    <Card className="xl:col-span-2">
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Categories</CardTitle>
                                <CardDescription>
                                    Current Categories from your store.
                                </CardDescription>
                            </div>
                            <Button 
                                size="sm" 
                                onClick={addCategory}
                                className="ml-auto gap-1"
                                disabled={isLoading}
                            >
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>No. of Product</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(categoryArray.length > 0) && categoryArray.map((category, key) => (
                                        <TableRow key={key}>
                                            <TableCell>
                                                <div className="font-medium">{category.title}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {category.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>{category._count.items}</TableCell>
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
                                                    <DropdownMenuItem
                                                        onClick={() => onOpen({title: category.title, id: category.id})}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className='text-red-500'
                                                        onClick={() => onDelete({title: category.title, id: category.id})}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  )
}

export default CategoryModal