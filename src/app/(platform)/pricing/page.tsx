import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import PricingSection from "@/components/PricingSection";

// import PricingSection from "@/components/PricingSection";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col items-center gap-5 bg-background p-5 md:px-20 xl:px-32">
			<h1 className="font mt-14 text-3xl font-bold">Simple, transparent pricing</h1>
			{/* <p className="text-muted-foreground">
				No hidden fees. No surprises. Just a simple, straightforward pricing model.
				<br />
				Pay only for what you need.
			</p> */}
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
	);
}
