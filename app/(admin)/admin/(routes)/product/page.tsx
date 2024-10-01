import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProductTable from '../../_components/table-product'
import ProductChart from "../../_components/chart-product"
import RankedItems from "../../_components/ranked-item"
import { SearchParams } from '@/lib/types'
import { searchParamsSchema } from '@/lib/validation'
import { getProducts } from '@/app/actions/get-products'
import { getCategoryStatistics } from '@/app/actions/get-categories-statistic'
import RankedContent from '../../_components/ranked-content'

export interface ProductPageProps {
    searchParams: SearchParams
}

const ProductPage = async ({
    searchParams
}: ProductPageProps) => {

    const search = searchParamsSchema.parse(searchParams)

    const productPromise = await getProducts(search)

    const {category, updates} = await getCategoryStatistics()
    
    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="w-full flex flex-col items-start gap-2">
                    <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                        Product Page
                    </h1>
                    <p className="max-w-2xl text-lg font-light text-foreground">
                        {`Monitor your product's information and easily manage updates to keep everything current and accurate.`}
                    </p>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    {/* ranked updated items */}
                    <Card x-chunk="dashboard-01-chunk-5">
                        <RankedItems  
                            title='Updated Products'
                            description='Top 5 Recently Updated Products.'
                        >
                            <RankedContent updates={updates} />
                        </RankedItems>
                    </Card>
                    {/* category number */}
                    <Card
                        className="xl:col-span-2 flex flex-col" x-chunk="dashboard-01-chunk-4"
                    >
                        <ProductChart 
                            title='Category Chart' 
                            description='Showing total number of products every category' 
                            data={category}
                        />
                    </Card>
                </div>
                {/* USER TABLE */}
                <div className="grid gap-4 md:gap-8 grid-cols-1">
                <Card
                    className="col-span-1"
                    x-chunk="dashboard-01-chunk-4"
                >
                    <CardHeader>
                        <CardTitle>Product Storage</CardTitle>
                    </CardHeader>
                    <ProductTable productPromise={productPromise} />
                </Card>
                </div>
            </main>
        </div>
    )
}

export default ProductPage