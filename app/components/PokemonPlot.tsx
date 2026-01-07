"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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

const chart_Data = [
  { month: "January", desktop: 186, mobile: 160 },
  { month: "February", desktop: 185, mobile: 170 },
  { month: "March", desktop: 207, mobile: 180 },
  { month: "April", desktop: 173, mobile: 160 },
  { month: "May", desktop: 160, mobile: 190 },
  { month: "June", desktop: 174, mobile: 204 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type PlotStat = {
  statname: string;
  pokemon1: string;
  pokemon2: string;
};

type PokemonPlotProps = {
  //props object
  plotStats: PlotStat[];
};

/*
    <MyComponent prop1={1} prop2={prop2} />

    props is { 
      prop1: 1;
      prop2: { prop2 }
    }             ✅
*/

// this is an aray of objects and each has 3 kv pairs
// PokemonPlotProps is an object that contains an array of plotStats and possibly many other props.

export function PokemonPlot({ plotStats }: PokemonPlotProps) {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Lines Only</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[550px]">
          <RadarChart data={plotStats}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="statname" />
            <PolarGrid radialLines={true} />
            <Radar
              dataKey="pokemon1"
              fill="var(--color-desktop)"
              fillOpacity={0.1}
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
            <Radar
              dataKey="pokemon2"
              fill="var(--color-mobile)"
              fillOpacity={0.1}
              stroke="var(--color-mobile)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
