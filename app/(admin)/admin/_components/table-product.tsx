"use client"
"use memo"

import Image from "next/image"
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import React, { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/app/(client)/account/_components/table/data-table/data-table-skeleton"
import { DataTableFilterField, OmittedProduct } from "@/lib/types"
import { useProductTable } from "@/hooks/admin/storage/use-product-storage"
import { getProductColumns } from "@/components/general/table/product-table-columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/general/table/data-table/data-table"
import { ProductsTableToolbarActions } from "@/components/general/table/data-table/product/product-table-toolbar-action"

interface ProductTableProps {
  productPromise: {
    data: OmittedProduct[],
    pageCount: number
  }
}

export default function ProductTable({
  productPromise
}: ProductTableProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { data = [], pageCount = 0 } = productPromise || {data: [], pageCount: 0};

  const {
    productsData,
    onRenderProduct
  } = useProductTable()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    onRenderProduct(data)
  }, [data, onRenderProduct])

  const productArray = Object.values(productsData)

  const columns = React.useMemo(() => getProductColumns(), [])

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
  const filterFields: DataTableFilterField<OmittedProduct>[] = [
    {
      label: "Title",
      value: "id",
      placeholder: "Filter titles...",
    },
  ]
  const { table } = useDataTable({
    data: productArray,
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
                {(!productsData)
                    ?   <div className="mt-4 flex min-h-screen flex-col items-center text-[#FEFEFE]">
                            No product for now.
                        </div>
                    :   <DataTable table={table}>
                          <ProductsTableToolbarActions table={table} />
                        </DataTable>
                }
            </React.Suspense>
        </div>
    </div>
  )
}
