"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Activity } from "lucide-react";

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
  pokemon1: number | string;
  pokemon2: number | string;
};

type PokemonPlotProps = {
  plotStats: PlotStat[];
  pokemon1Name?: string;
  pokemon2Name?: string;
};

export function PokemonPlot({
  plotStats,
  pokemon1Name = "Pokemon 1",
  pokemon2Name = "Pokemon 2",
}: PokemonPlotProps) {
  return (
    <Card className="mt-8 sm:mt-10 bg-transparent border-border/50 overflow-hidden">
      <CardHeader className="relative items-center pb-2 sm:pb-4 px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--electric)/0.1)] border border-[hsl(var(--electric)/0.2)] mb-2">
          <Activity className="w-3.5 h-3.5 text-[hsl(var(--electric))]" />
          <span className="text-xs font-medium text-[hsl(var(--electric))]">Stats Analysis</span>
        </div>

        <CardTitle className="text-lg sm:text-xl font-black text-foreground">
          Battle Stats Breakdown
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Who has the edge? Compare their combat abilities below
        </CardDescription>

        {/* Legend */}
        <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-[0_0_0_2px_hsl(var(--card)),0_0_0_4px_hsl(var(--chart-1)/0.3)]"
              style={{ backgroundColor: "hsl(var(--chart-1))" }}
            />
            <span className="text-xs sm:text-sm font-semibold capitalize text-foreground">
              {pokemon1Name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-[0_0_0_2px_hsl(var(--card)),0_0_0_4px_hsl(var(--chart-2)/0.3)]"
              style={{ backgroundColor: "hsl(var(--chart-2))" }}
            />
            <span className="text-xs sm:text-sm font-semibold capitalize text-foreground">
              {pokemon2Name}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pb-4 sm:pb-6 px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] sm:max-h-[260px] md:max-h-[300px]"
        >
          <RadarChart data={plotStats}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis
              dataKey="statname"
              tick={{
                fontSize: 13,
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 500,
              }}
            />
            <PolarGrid
              radialLines={true}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <Radar
              dataKey="pokemon1"
              fill="var(--color-desktop)"
              fillOpacity={0.15}
              stroke="var(--color-desktop)"
              strokeWidth={2.5}
            />
            <Radar
              dataKey="pokemon2"
              fill="var(--color-mobile)"
              fillOpacity={0.15}
              stroke="var(--color-mobile)"
              strokeWidth={2.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
