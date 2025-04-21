import { Suspense } from "react";

import { PricingCard } from "@/components/PricingCard";
import PricingSection from "@/components/PricingSection";

// import PricingSection from "@/components/PricingSection";

// TODO: buttons should react to userType and subscription states/status.

export default function Page() {

	return (
		<div className="flex flex-1 flex-col items-center gap-5 bg-background p-5 md:px-20 xl:px-32">
			<h1 className="font text-3xl font-bold mt-14">Simple, transparent pricing</h1>
			{/* <p className="text-muted-foreground">
				No hidden fees. No surprises. Just a simple, straightforward pricing model.
				<br />
				Pay only for what you need.
			</p> */}
			<Suspense fallback={<div className="flex h-96 items-center justify-center">Loading...</div>}>
				<PricingSection />
			</Suspense>
		</div>
	);
}
