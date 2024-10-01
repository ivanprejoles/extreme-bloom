'use client'

import Link from "next/link"
import {
  Copy,
  MoreVertical,
  Pen
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import CartTable from "../_components/cart-table"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useMemo, useState } from 'react'
import axios from "axios"
import { AccountOrder, AccountType, OrderItem } from "@/lib/types"
import { MapDrawer } from "@/components/general/map-drawer"
import { formatDate } from "@/lib/utils"
import { useAccountUpdateModal } from "@/hooks/use-account-update"



export default function AccountPage() {
    const [orders, setOrders] = useState<AccountOrder[]>([]);
    const [user, setUser] = useState<AccountType>();
    const [isLoading, setIsLoading] = useState(true);
    const {onOpen} = useAccountUpdateModal()

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const response = await axios.post('/api/getAccount', { id: user.uid });
                    setOrders(response.data.orders);
                    setUser(response.data.information);
                } catch (error) {
                    console.error('error: ', error);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    // Render while loading
    if (isLoading) {
        return <div>Loading...</div>; // Show loading indicator
    }
      
    const copyId = (id: string) => {
        // Check if the browser supports the Clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(id)
            .then(() => {
                console.log("ID copied to clipboard successfully!");
            })
            .catch(err => {
                console.error("Failed to copy ID to clipboard: ", err);
            });
        } else {
            console.error("Clipboard API not supported in this browser.");
        }
    };


    return (
        <div className="flex w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                        <div className="grid gap-4">
                        <Card
                            x-chunk="dashboard-05-chunk-0"
                        >
                            <CardHeader className="pb-3">
                            <CardTitle>Your Orders</CardTitle>
                            <CardDescription className="text-balance max-w-lg leading-relaxed">
                                • Create new order to redirect to market page.<br/> • An order can only be deleted within 12 hours. <br /> • Providing a reference is important for us to verify your identity.
                            </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href='/#item-storage'>
                                    <Button>Create New Order</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                        </div>
                        <CartTable orders={orders} />
                    </div>
                    <div>
                        <Card
                            className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
                        >
                            {user && (
                                <>
                                    <CardHeader className="flex flex-row items-start bg-muted/50">
                                        <div className="grid gap-0.5">
                                            <CardTitle className="group flex items-center gap-2 text-lg">
                                                Reference: {user.id}
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyId(user.id)}
                                                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                    <span className="sr-only">Copy Order ID</span>
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>{`Date Created: ${formatDate(user.createdAt as Date)}`}</CardDescription>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1">
                                                    <Button 
                                                        onClick={() => onOpen({email: user.email, id: user.id, facebook: user.facebook as string, number: user.number as string})} 
                                                        size="icon" 
                                                        variant="outline" 
                                                        className="h-8 w-8"
                                                    >
                                                        <Pen className="h-3.5 w-3.5" />
                                                        <span className="sr-only">More</span>
                                                    </Button>
                                                
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 text-sm">
                                        <div className="grid gap-3">
                                            <div className="font-semibold">Account Details</div>
                                            <ul className="grid gap-3">    
                                                <li className="flex items-center justify-between">
                                                    <span className="text-muted-foreground line-clamp-1">
                                                        <b>Email:</b> {user.email}
                                                    </span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-muted-foreground line-clamp-1">
                                                        <b>Facebook:</b> {(user.facebook && user.facebook.length > 0) ? user.facebook : 'None'}
                                                    </span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-muted-foreground line-clamp-1">
                                                        <b>Phone No.:</b> {(user.number && user.number.length > 0) ? user.number : 'None'}
                                                    </span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-muted-foreground line-clamp-1">
                                                        {user.role}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </>
                            )}  
                        </Card>
                    </div>
                </main>
            </div>
            <MapDrawer />
        </div>
    )
}
