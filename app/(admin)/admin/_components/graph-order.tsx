"use client"

import { parseISO, isValid, format } from 'date-fns';
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { OrderChart, OrderCount } from "@/lib/types"
import { Status } from "@prisma/client"
import { formatDate } from '@/lib/utils';

const chartConfig = {
  Declined: {
    label: "Declined",
    color: "hsl(var(--chart-1))",
  },
  Waiting: {
    label: "Waiting",
    color: "hsl(var(--chart-2))",
  },
  Done: {
    label: "Done",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig


interface OrderGraphProps {
  title: string,
  description: string,
  data: OrderCount[]
}

export default function OrderGraph({
  title,
  description,
  data
}: OrderGraphProps) {
  const [activeStatus, setActiveStatus] = React.useState<keyof typeof chartConfig | 'All'>("All")

  const changedData = data.map(item => {
    return {
      ...item,
      updatedAt: formatDate(item.updatedAt),
      items: Array.isArray(item.items) ? item.items.length : 0
    };
  });

  const filteredData = React.useMemo(() => {
    return activeStatus === 'All' ? changedData : changedData.filter(order => order.status === activeStatus)
  }, [activeStatus])

  const total = React.useMemo(() => ({
    All: changedData.reduce((acc, curr) => acc + curr.amount, 0),
    Declined: changedData.filter(order => order.status === Status.Declined).reduce((acc, curr) => acc + curr.amount, 0),
    Waiting: changedData.filter(order => order.status === Status.Waiting).reduce((acc, curr) => acc + curr.amount, 0),
    Done: changedData.filter(order => order.status === Status.Done).reduce((acc, curr) => acc + curr.amount, 0),
  }), [])

  return (
    <>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Individual Orders</CardTitle>
          <CardDescription>
            Showing individual order by items and status
          </CardDescription>
        </div>
        <div className="flex flex-wrap">
          {['All', ...Object.keys(chartConfig)].map((status) => (
            <button
              key={status}
              data-active={activeStatus === status}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveStatus(status as keyof typeof chartConfig | 'All')}
            >
              <span className="text-xs text-muted-foreground">
                {status === 'All' ? 'All Orders' : chartConfig[status as keyof typeof chartConfig].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                ${total[status as keyof typeof total]}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="updatedAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return formatDate(value).split(',')[0];
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 rounded shadow">
                      <p className="font-bold">{formatDate(label)}</p>
                      <p><b>Items: </b>{payload[0].value}</p>
                      <p><b>Status: </b>{payload[0].payload.status}</p>
                      <p><b>Amount: </b>₱{payload[0].payload.amount}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey='items' fill={`var(--color-${activeStatus})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  )
}