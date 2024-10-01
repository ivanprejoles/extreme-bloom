"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { CategoryCount } from "@/lib/types";
import { generateDistinctBlueShade } from "@/lib/utils";
import { useProductTable } from "@/hooks/admin/storage/use-product-storage";
import { useCategoryModal } from "@/hooks/use-category-modal";

const chartConfig = {
  product: {
    label: "Product",
  },
} satisfies ChartConfig;

interface StatChartProps {
  title: string;
  description: string;
  data: CategoryCount[];
}

export default function ProductChart({
  title,
  description,
  data,
}: StatChartProps) {
  const { category, onAddCategory } = useProductTable();
  const { onOpen } = useCategoryModal()

  React.useEffect(() => {
    if (Object.keys(category).length === 0 && data.length > 0) {
      const categoryCountObject = Object.fromEntries(
        data.map(cat => [cat.id, cat])
      );
      onAddCategory(categoryCountObject);
    }
  }, [category, data, onAddCategory]);

  const structuredData = React.useMemo(() => {
    if (!category || Object.keys(category).length === 0) {
      return [];
    }
  
    return Object.values(category).map(({ title, id, _count }) => ({
      title,
      id,
      count: _count.items,
      fill: generateDistinctBlueShade(),
    }));
  }, [category]);

  return (
    <>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex">
            <button
              onClick={onOpen}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            >
              <span className="text-lg font-bold leading-none sm:text-3xl">Categories</span>
              <span className="text-xs text-muted-foreground">Add and Delete</span>
            </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="product" hideLabel />} />
            <Pie data={structuredData} dataKey="count">
              <LabelList dataKey="title" className="fill-background" stroke="none" fontSize={12} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Updated categories count this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total count of unique products in every category.
        </div>
      </CardFooter>
    </>
  );
}
