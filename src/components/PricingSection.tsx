import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createKv, stripeAdmin as stripe, createClient } from "@/lib/store.server";
import { isDev } from "@/lib/utils.server";

import { PricingCard } from "./PricingCard";
import { Skeleton } from "@/components/ui/skeleton";

import { plans } from "@/lib/shared";

import type { Plan } from "@/types";

async function getCurrentPlanName(): Promise<string | null> {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		return null;
	}
	const uid = user.id;

	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);

	if (!customerId) {
		return null;
	}

	const subscriptions = await stripe.subscriptions.list({
		customer: customerId as string, // Pass the customer ID
		limit: 1, // Fetch only the most recent subscription
	});

	if (!subscriptions.data.length) {
		return null;
	}

	const subscription = subscriptions.data[0];

	const productId = subscription.items.data[0].price.product as string;
	const product = await stripe.products.retrieve(productId);

	return product.name;
}

export default async function PricingSection() {
	const currentPlanName = await getCurrentPlanName();

	return (
		<div className="mt-8 grid w-full grid-cols-1 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3">
			{plans.map((plan, index) => (
				<PricingCard key={index} plan={plan as Plan} currentPlanName={currentPlanName} />
			))}
		</div>
	);
}
