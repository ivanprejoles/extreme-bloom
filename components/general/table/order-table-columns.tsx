"use client"

import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import { formatDate, formatNumber, formatProducts } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "./data-table/data-table-column-header"

import Image from "next/image"
import { OmittedOrder} from "@/lib/types"
import TooltipWrapper from "../tooltip-wrapper"
import { Status } from "@prisma/client"
import { getStatusIcon } from "../icons"
import { JsonArray } from "@prisma/client/runtime/library"
import OrderTooltipWrapper from "../order-tooltip-wrapper"
import { DeleteOrderDialog } from "./data-table/delete-order-dialog"
import axios from "axios"
import { useOrderTable } from "@/hooks/admin/storage/use-order-storage"
import { useOrderDeleteModal } from "@/hooks/use-order-delete"

type OrderKeys = keyof OmittedOrder;

export const orderKeys: OrderKeys[] = [
    'id',
    'email',
    'role',
    'facebook',
    'number',
    'imageSrc',
    'status',
    'createdAt',
    'updatedAt',
    'items',
    'amount'
];

export function getOrderColumns(): ColumnDef<OmittedOrder>[] {
  
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 "
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "imageSrc",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-x-2 w-auto flex justify-start items-center">
            <Image
              src={row.getValue('imageSrc') || '/no-image.png'}
              alt='User Profile'
              // layout="fill"
              height={50}
              width={50}
              className="object-cover rounded-full"
            />
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {

          return (
            <div className="flex space-x-2">
              <span className="max-w-[31.25rem] truncate font-medium">
                <TooltipWrapper text={row.getValue("email")} maxLength={15} />
              </span>
            </div>
          )
        },
      },
    {
      accessorKey: "facebook",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Facebook" />
      ),
      cell: ({ row }) => {

        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
                <TooltipWrapper maxLength={10} text={row.getValue("facebook")|| ''} />
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone No." />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">{row.getValue('number')}</span>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">{row.getValue('role')}</span>
          </div>
        )
      },
    },
    {
        accessorKey: "items",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Products" />
        ),
        cell: ({ row }) => {
            
            
            const value = row.getValue('items') as JsonArray

            const {formattedWithBr, formattedWithoutBr} = formatProducts(value)

            return (
                <div className="flex space-x-2">
                    <span className="max-w-[31.25rem] truncate font-medium">
                        <OrderTooltipWrapper maxLength={20} value={formattedWithoutBr} text={formattedWithBr} />
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = Object.values(Status).find(
                (status) => status === row.original.status
              );
  
            if (!status) return null
    
            const Icon = getStatusIcon(status)
    
            return (
                <div className="flex w-[6.25rem] items-center">
                    <Icon
                        className="mr-2 size-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <span className="capitalize">{status}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
            return (
              <div className="flex w-[6.25rem] items-center">
                <svg className="mr-2 size-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M64 32C46.3 32 32 46.3 32 64l0 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 64 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 80 0c68.4 0 127.7-39 156.8-96l19.2 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-.7 0c.5-5.3 .7-10.6 .7-16s-.2-10.7-.7-16l.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-19.2 0C303.7 71 244.4 32 176 32L64 32zm190.4 96L96 128l0-32 80 0c30.5 0 58.2 12.2 78.4 32zM96 192l190.9 0c.7 5.2 1.1 10.6 1.1 16s-.4 10.8-1.1 16L96 224l0-32zm158.4 96c-20.2 19.8-47.9 32-78.4 32l-80 0 0-32 158.4 0z"/>
                </svg>
                <span className="capitalize">{formatNumber(row.getValue('amount')||0)}</span>
              </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const {UpdateStatus} = useOrderTable()
        const {onDelete} = useOrderDeleteModal()
        const [isLoading, setIsLoading] = React.useState(false)      
        const data = row.original

        const onUpdateStatus = async (id: string, status: Status) => {
          if (isLoading) return
          setIsLoading(true)
          await axios.post('/api/updateStatus', {id, status})
            .then((response) => {
              UpdateStatus({id, status: response.data.status})
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => {
              setIsLoading(false)
            })
        }

        const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false)

        return (
          <>
            <DeleteOrderDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              ordersId={[row.original.id]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Status Action</DropdownMenuLabel>
                {/* under-construction */}
                {!isLoading && (
                  <>
                    {(data.status === Status.Waiting) && (
                      <>
                        <DropdownMenuItem
                          className="text-red-300"
                          onSelect={() => onUpdateStatus(data.id, Status.Declined)}
                        >
                          Decline
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-green-300"
                          onSelect={() => onUpdateStatus(data.id, Status.Done)}
                        >
                          Done
                        </DropdownMenuItem>
                      </>
                    )}
                    {(data.status === Status.Declined) && (
                      <>
                        <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => onDelete({id: data.id, name: data.email})}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-yellow-300"
                          onSelect={() => onUpdateStatus(data.id, Status.Waiting)}
                        >
                          Wait
                        </DropdownMenuItem>
                      </>
                    )}
                    {(data.status === Status.Done) && (
                      <>
                        <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => onDelete({id: data.id, name: data.email})}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-yellow-300"
                          onSelect={() => onUpdateStatus(data.id, Status.Waiting)}
                        >
                          Wait
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
      size: 10,
    },
  ]
}