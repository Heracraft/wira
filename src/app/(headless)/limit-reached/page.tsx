import { Suspense } from "react";

import PricingSection from "@/components/PricingSection";

import { AlertTriangle, Check, ChevronRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default async function page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	let limit=((await searchParams).limit as string) || 5;
	return (
		<div className="flex w-full justify-center py-5">
			<Card className="max-w-6xl border-primary-200 shadow-lg">
				<CardHeader className="border-b pb-3">
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-xl font-bold">Talent Engagement Limit Reached</CardTitle>
							<CardDescription className="mt-1">You've reached the maximum talent engagements for your current plan</CardDescription>
						</div>
						<AlertTriangle className="h-6 w-6 text-amber-500" />
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Talent Engagements</span>
								<span className="font-medium">{limit} / {limit}</span>
							</div>
							<Progress value={100} className="h-2 bg-primary-100" />
						</div>

						<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">You've used all your available talent engagements. Upgrade your plan to continue engaging with more candidates.</div>

						<div className="space-y-4">
							<h3 className="font-medium">Choose an upgrade plan:</h3>
							<Suspense
								fallback={
									<div className="mt-8 grid w-full grid-cols-1 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3">
										{Array.from({ length: 3 }, (_, i) => (
											<Skeleton key={i} className="flex h-80 w-full max-w-xs flex-col gap-2 rounded-xl border p-3"></Skeleton>
										))}
									</div>
								}
							>
								<PricingSection />
							</Suspense>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between border-t pt-6">
					<Button variant="outline">Contact Support</Button>
					{/* <Button className="gap-1 bg-primary-600 hover:bg-primary-700" disabled={!selectedPlan}>
						{selectedPlan ? plans.find((p) => p.id === selectedPlan)?.actionLabel || "Upgrade Now" : "Upgrade Now"}
						<ChevronRight className="h-4 w-4" />
					</Button> */}
				</CardFooter>
			</Card>
		</div>
	);
}
