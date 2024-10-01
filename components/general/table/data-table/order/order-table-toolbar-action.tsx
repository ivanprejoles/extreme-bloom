"use client"

import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { DeleteProductsDialog } from "@/components/general/table/data-table/delete-product-dialog"
import { OmittedOrder} from "@/lib/types"
import { useProductsAddModal } from "@/hooks/admin/storage-update/use-products-add-modal"
import { DeleteOrderDialog } from "../delete-order-dialog"

interface OrdersTableToolbarActionsProps {
  table: Table<OmittedOrder>
}

export function  OrdersTableToolbarActions({
  table,
}: OrdersTableToolbarActionsProps) {

    return (
        <div className="flex items-center gap-2 justify-end">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <DeleteOrderDialog
                    ordersId={table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original.id)}
                    onSuccess={() => table.toggleAllRowsSelected(false)}
                />
            ) : null}
        <Button
            variant="outline"
            size="sm"
            onClick={() =>
                exportTableToCSV(table, {
                    filename: "tasks",
                    excludeColumns: ["select", "actions"],
                })
            }
        >
            <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
            Export
        </Button>
        {/**
         * Other actions can be added here.
         * For example, import, view, etc.
         */}
        </div>
    )
}
