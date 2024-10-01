"use client"
"use memo"

import React, { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/app/(client)/account/_components/table/data-table/data-table-skeleton"
import { DataTableFilterField, OmittedOrder} from "@/lib/types"
import { getOrderColumns } from "@/components/general/table/order-table-columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/general/table/data-table/data-table"
import { useOrderTable } from "@/hooks/admin/storage/use-order-storage"
import { OrdersTableToolbarActions } from "@/components/general/table/data-table/order/order-table-toolbar-action"

interface OrderTableProps {
  orderPromise: {
    data: OmittedOrder[],
    pageCount: number
  }
}

export default function OrderTable({
  orderPromise
}: OrderTableProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { data = [], pageCount = 0 } = orderPromise || {data: [], pageCount: 0};

  const {
    ordersData,
    onRenderOrder
  } = useOrderTable()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
      onRenderOrder(data)
  }, [data, onRenderOrder])

  const orderArray = Object.values(ordersData)

  const columns = React.useMemo(() => getOrderColumns(), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<OmittedOrder>[] = [
    {
      label: "Title",
      value: "id",
      placeholder: "Filter titles...",
    },
  ]
  const { table } = useDataTable({
    data: orderArray,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    // enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    /* */
  })

  if (!isMounted) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col p-10 pt-0">
        <div className="h-auto w-full">
            <React.Suspense fallback={<Skeleton className="h-7 w-52" />}></React.Suspense>
            <React.Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={5}
                        searchableColumnCount={1}
                        filterableColumnCount={2}
                        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                        shrinkZero
                    />
                }
            >
                {(!ordersData)
                    ?   <div className="mt-4 flex min-h-screen flex-col items-center text-[#FEFEFE]">
                            No product for now.
                        </div>
                    :   <DataTable table={table}>
                          <OrdersTableToolbarActions table={table} />
                        </DataTable>
                }
            </React.Suspense>
        </div>
    </div>
  )
}
