"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEventAddModal } from "@/hooks/use-event-add";
import { useToast } from "@/hooks/use-toast"
import { Trash } from "lucide-react";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { FileUploader } from "../ui/file-uploader";
import { ScrollArea } from "../ui/scroll-area";

const formSchema = z.object({
    title: z.string().min(2),
    label: z.string().min(2),
    imageUrl: z.string().min(2)
});

type EventModalProps = z.infer<typeof formSchema>

export const EventModal = () => {
    const [currentImage, setCurrentImage] = useState('')
    const [newImage, setNewImage] = useState<File>();
    
    const router = useRouter();
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);
    
    const {
        data,
        isOpen,
        onClose
    } = useEventAddModal()


    const title = data ? "Edit Event" : "Create Event"
    const description = data ? "Edit event" : "Add a new event"
    const toastMessage = data ? "Event updated." : "Event created."
    const action = data ? "Save changes" : "Create"

    const form = useForm<EventModalProps>({
        resolver: zodResolver(formSchema),
        defaultValues: data || {
            title: '',
            label: '',
            imageUrl: ''
        }
    });

    useEffect(() => {
        formReset()
    }, [data])

    const formReset = () => {
        if (data) {
            form.setValue('title', data.title)
            form.setValue('label', data.description)
            form.setValue('imageUrl', data.imageSrc)
            setCurrentImage(data.imageSrc)
        }
    }


    const onSubmit = async (values: EventModalProps) => {
        setLoading(true);
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
    
                values.imageUrl = downloadURL
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

        try {
            if (data) {
                await axios.patch(`/api/event/${data.id}`, values);
            } else {
                await axios.post(`/api/event`, values);
            }
            router.refresh();
            toast({
                title: title,
                description: toastMessage
            });
        } catch (error) {
            toast({
                title: 'Something went wrong',
                description: 'Please Try again.'
            });
        } finally {
            setLoading(false);
            handleClose()
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/event/${data?.id}`)
            router.refresh();

            toast({
                title: "Event Deleted Successfully.",
                description: "Event deleted, please wait.",
            })
        } catch (error) {
            toast({
                title: 'Something went wrong.',
                description: 'Please try again.'
            })
        } finally {
            setLoading(false);
            handleClose()
        }
    }
    
    const handleFileUpload = (files: File[]) => {
        setNewImage(files[0])
        form.setValue('imageUrl', 'added image')
    };
    
    const handleClose = () => {
        onClose()
        form.reset()   
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg pt-6">
                <DialogHeader>
                    <DialogTitle  className="text-3xl font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="px-3">
                    {data && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="icon"
                            onClick={onDelete}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>  
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <div className="grid grid-cols-1 gap-2">
                                <FileUploader onChange={handleFileUpload} />
                            </div>
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input className="md:w-full w-60" disabled={loading} placeholder="Event Title" {...field} />
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input className="md:w-full w-60" disabled={loading} placeholder="Event Description" {...field} />
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button disabled={loading} className="ml-auto" type="submit">
                                {action}
                            </Button>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}