"use client";

import { Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
	trait: {
		label: "Trait",
	},
	Openness: {
		label: "Openness",
		color: "hsl(var(--chart-1))",
	},
	Conscientiousness: {
		label: "Conscientiousness",
		color: "hsl(var(--chart-2))",
	},
	Extraversion: {
		label: "Extraversion",
		color: "hsl(var(--chart-3))",
	},
	Agreeableness: {
		label: "Agreeableness",
		color: "hsl(var(--chart-4))",
	},
	Neuroticism: {
		label: "Neuroticism",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

export default function PersonalityTraitsChart({ chartData }: { chartData: any }) {
	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Personality Traits</CardTitle>
				{/* <CardDescription>January - June 2024</CardDescription> */}
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie data={chartData} dataKey="value" nameKey="trait" innerRadius={50} />
						<ChartLegend
							content={<ChartLegendContent nameKey="trait" />}
							wrapperStyle={{
								overflow: "auto",
							}}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
