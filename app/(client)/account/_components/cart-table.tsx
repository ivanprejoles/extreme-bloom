"use client"

import OrderTooltipWrapper from "@/components/general/order-tooltip-wrapper"
import TooltipWrapper from "@/components/general/tooltip-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAccountUpdateModal } from "@/hooks/use-account-update"
import { useToast } from "@/hooks/use-toast"
import { AccountOrder } from "@/lib/types"
import { formatDate, formatNumber, formatProducts } from "@/lib/utils"
import { Status } from "@prisma/client"
import axios from "axios"
import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

interface CartTable {
  orders: AccountOrder[]
}

export default function CartTable({
  orders
}: CartTable) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const recentOrderIds = useMemo(() => {
    const halfADayInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const currentTime = Date.now();

    return orders
        .filter(order => (currentTime - new Date(order.createdAt).getTime()) < halfADayInMilliseconds)
        .map(order => order.id);
  }, [orders]);

  const onDeleteUserOrder = async (userId: string) => {
    if (!recentOrderIds.includes(userId) || isLoading) return
    setIsLoading(true)
    await axios.post('/api/deleteUserOrder', {userId})
      .then((response) => {
        toast({
          title: 'Order Deleted Successfully',
          description: 'Please refresh your page to see the current status.'
        })
        router.refresh()
      })
      .catch((error) => {
        toast({
          title: 'Error Deleting Order',
          description: 'Please check and refresh your page. Try again.'
        })
        console.log('error: ', error)
      })
      .then(() => {
        setIsLoading(false)
      })
  } 

  
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Your current order.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sm:table-cell">Reference</TableHead>
              <TableHead className="sm:table-cell">Products</TableHead>
              <TableHead className="md:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Updated At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {orders.length > 0 && orders.map((order) => {

            const {formattedWithBr, formattedWithoutBr} = formatProducts(order.items)

            return (
              <TableRow key={order.id}>
                <TableCell className="sm:table-cell">
                  <TooltipWrapper maxLength={20} text={order.id} />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <OrderTooltipWrapper maxLength={20} value={formattedWithoutBr} text={formattedWithBr} />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <Badge className="text-xs" variant="outline">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span style={{ lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>
                    <svg 
                      className="text-muted-foreground" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 384 512" 
                      width="1em" 
                      height="1em" 
                      style={{ verticalAlign: 'middle' }}
                    >
                      <path d="M64 32C46.3 32 32 46.3 32 64l0 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 64 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 80 0c68.4 0 127.7-39 156.8-96l19.2 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-.7 0c.5-5.3 .7-10.6 .7-16s-.2-10.7-.7-16l.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-19.2 0C303.7 71 244.4 32 176 32L64 32zm190.4 96L96 128l0-32 80 0c30.5 0 58.2 12.2 78.4 32zM96 192l190.9 0c.7 5.2 1.1 10.6 1.1 16s-.4 10.8-1.1 16L96 224l0-32zm158.4 96c-20.2 19.8-47.9 32-78.4 32l-80 0 0-32 158.4 0z"/>
                    </svg>
                  </span>
                  {formatNumber(order.amount || 0)}
                </TableCell>
                <TableCell className="md:table-cell">{formatDate(order.updatedAt as Date)}</TableCell>
                <TableCell className="md:table-cell">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="h-8 w-8">
                              <MoreVertical className="h-3.5 w-3.5" />
                              <span className="sr-only">More</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          {(recentOrderIds.includes(order.id) && (
                            <DropdownMenuItem
                              className="text-red-400"
                              disabled={isLoading || !recentOrderIds.includes(order.id)}
                              onClick={() => onDeleteUserOrder(order.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {orders.length <= 0 && (
            <div className="mt-4 flex h-auto flex-col items-center w-full">
              No product for now.
            </div>
          )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
