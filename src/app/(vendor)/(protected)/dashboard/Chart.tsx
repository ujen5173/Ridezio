"use client";

import { Area, AreaChart, CartesianGrid, Tooltip } from "recharts";

import { type ChartConfig, ChartContainer } from "~/components/ui/chart";

const chartConfig = {
  value: {
    label: "Chart Data",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Chart({
  chartColor,
  chartData,
}: {
  chartColor: string;
  chartData: { date: string; value: number }[];
}) {
  return (
    <ChartContainer className="h-16 w-full" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        height={50}
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />

        <Tooltip />

        <Area
          dataKey="value"
          type="basis"
          fill={chartColor}
          fillOpacity={0.4}
          stroke={chartColor}
        />
      </AreaChart>
    </ChartContainer>
  );
}
