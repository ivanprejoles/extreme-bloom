import { getOrders } from '@/app/actions/get-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchParams } from '@/lib/types'
import { searchParamsSchema } from '@/lib/validation'
import React from 'react'
import OrderTable from '../../_components/table-order'
import RankedItems from '../../_components/ranked-item'
import { getOrderStatistics } from '@/app/actions/get-orders-statistic'
import RankedOrders from '../../_components/ranked-order'
import OrderGraph from '../../_components/graph-order'

export interface OrderPageProps {
  searchParams: SearchParams
}

const OrderPage = async ({
  searchParams
}: OrderPageProps) => {

  const search = searchParamsSchema.parse(searchParams)

  const orderPromise = await getOrders(search)

  const {newOrders, orders} = await getOrderStatistics()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="w-full flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                Order Page
            </h1>
            <p className="max-w-2xl text-lg font-light text-foreground">
                {`Monitor your order's information and easily manage updates to keep everything current and accurate.`}
            </p>
          </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card x-chunk="dashboard-01-chunk-5">
            <RankedItems  
                title='New Orders'
                description='Top 5 Recently Created Order.'
            >
                <RankedOrders updates={newOrders} />
            </RankedItems>
          </Card>
          <Card
              className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <OrderGraph
              title='Monthly Order'
              description='Track and monitor order status with accurate data displayed in easy-to-understand graphs for efficient management.'
              data={orders}
            />
          </Card>
        </div>

        {/* USER TABLE */}
        <div className="grid gap-4 md:gap-8 grid-cols-2">
          <Card
            className="col-span-2"
               x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader>
              <CardTitle>Order Storage</CardTitle>
            </CardHeader>
            <OrderTable orderPromise={orderPromise} />
          </Card>
        </div>
      </main>
    </div>
  )
}

export default OrderPage