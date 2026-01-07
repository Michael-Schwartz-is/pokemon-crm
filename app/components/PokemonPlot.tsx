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
  plotStats: PlotStat[];
  pokemon1Name?: string;
  pokemon2Name?: string;
};

export function PokemonPlot({ plotStats, pokemon1Name = "Pokemon 1", pokemon2Name = "Pokemon 2" }: PokemonPlotProps) {
  return (
    <Card className="mt-6 sm:mt-8">
      <CardHeader className="items-center pb-2 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Stats Comparison</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Head-to-head stat breakdown</CardDescription>
        {/* Legend */}
        <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
            <span className="text-xs sm:text-sm font-medium capitalize">{pokemon1Name}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
            <span className="text-xs sm:text-sm font-medium capitalize">{pokemon2Name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0 px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px] sm:max-h-[400px] md:max-h-[550px]">
          <RadarChart data={plotStats}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis 
              dataKey="statname" 
              tick={{ fontSize: 10 }}
              className="text-[8px] sm:text-[10px] md:text-xs"
            />
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
