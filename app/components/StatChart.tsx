"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pokemon, Stats } from "@/util/CachePokemons";

const chartConfig = {
  base_stat: {
    label: "yes!",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};
// satisfies ChartConfig

type statChartProps = {
  chartData: {
    base_stat: string;
    effort: string;
    name: string;
  }[];
  name: string;
};

const chartData = [
  { base_stat: "defense", pokemon1: 186, pokemon2: 160 },
  { base_stat: "Attack", pokemon1: 185, pokemon2: 170 },
  { base_stat: "hp", pokemon1: 207, pokemon2: 180 },
  { base_stat: "special attack", pokemon1: 173, pokemon2: 160 },
  { base_stat: "May", pokemon1: 160, pokemon2: 190 },
  { base_stat: "June", pokemon1: 174, pokemon2: 204 },
];

export function StatChart({ chartData, name }: statChartProps) {
  return (
    <>
      <Card>
        {/* <CardHeader>
   
          <CardTitle>{name}</CardTitle>{" "}
        </CardHeader> */}
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ right: 16 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={20}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="base_stat" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="base_stat" layout="vertical" fill="var(--color-desktop)" radius={4}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={14}
                />
                <LabelList
                  dataKey="base_stat"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          maybe some data here later
        </CardFooter> */}
      </Card>
    </>
  );
}
