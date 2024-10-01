"use client"

import * as React from "react"
import { Cart, Item, Status } from "@prisma/client"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
// import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error" 
import { formatDate, formatNumber, truncateText } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "./data-table/data-table-column-header"

// import { updateTask } from "../_lib/actions"
import { getStatusIcon, StatusProps } from "@/components/general/icons"
import Image from "next/image"
import { OmittedProduct } from "@/lib/types"
import TooltipWrapper from "../tooltip-wrapper"
// import { DeleteTasksDialog } from "@/app/(client)/account/_components/table/data-table/delete-task-dialog"
import { useProductUpdateModal } from "@/hooks/admin/storage-update/use-product-update-modal"
import { DeleteProductsDialog } from "./data-table/delete-product-dialog"

type ProductKeys = keyof OmittedProduct;

export const productKeys: ProductKeys[] = [
  'id',
  'title',
  'itemTitle',
  'categoryId',
  'imageSrc',
  'maxOrder',
  'price',
  'description',
  'quantity',
  'createdAt',
  'updatedAt'
];

export function getProductColumns(): ColumnDef<OmittedProduct>[] {
  
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
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-x-2 w-full overflow-hidden p-2 relative h-[90px] flex justify-start items-center">
            <div className="h-fit max-h-full relative w-fit max-w-full rounded-sm overflow-hidden">
              <Image
                src={row.getValue('imageSrc') || '/no-image.png'}
                alt={row.getValue('title')}
                // layout="fill"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {

        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              <TooltipWrapper text={row.getValue("title")} />
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "categoryId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const title = row.original.itemTitle
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              <Badge variant="default">{title}</Badge>
            </span>
          </div>
        )
      },
    },
    
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">{row.getValue('quantity')}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <svg className="mr-2 size-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M64 32C46.3 32 32 46.3 32 64l0 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 64 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 80 0c68.4 0 127.7-39 156.8-96l19.2 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-.7 0c.5-5.3 .7-10.6 .7-16s-.2-10.7-.7-16l.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-19.2 0C303.7 71 244.4 32 176 32L64 32zm190.4 96L96 128l0-32 80 0c30.5 0 58.2 12.2 78.4 32zM96 192l190.9 0c.7 5.2 1.1 10.6 1.1 16s-.4 10.8-1.1 16L96 224l0-32zm158.4 96c-20.2 19.8-47.9 32-78.4 32l-80 0 0-32 158.4 0z"/>
            </svg>
            <span className="capitalize">{formatNumber(row.getValue('price')||0)}</span>
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
        const data = row.original
        const {onOpen} = useProductUpdateModal()
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)


        return (
          <>
            <DeleteProductsDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              productsId={[row.original.id]}
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
                <DropdownMenuItem onSelect={() => onOpen(data)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
      size: 10,
    },
  ]
}