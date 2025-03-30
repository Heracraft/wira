import { createKv, stripeAdmin as stripe } from "@/lib/store.server";

import { headers } from "next/headers";

import { isDev } from "@/lib/utils.server";

export default async function Page() {
	const headersList = await headers();
	const uid = headersList.get("x-uid");
	if (!uid) {
		return new Response(JSON.stringify({ error: "User not found" }), { status: 401 });
	}

	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);
	const subscription = await kv.get(`${isDev ? "test-" : ""}stripe:subscription:${customerId}`);
	if (!customerId) {
		return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
	}
	if (!subscription) {
		return new Response(JSON.stringify({ error: "Subscription not found" }), { status: 404 });
	}
	const subscriptionData = JSON.parse(subscription);
	console.log("Subscription Data: ", subscriptionData);

	const plan =await stripe.subscriptions.retrieve(subscriptionData.subscriptionId);
    console.log("Plan: ", plan);
    

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<h1 className="text-3xl font-bold">Billing</h1>
			<p className="mt-4 text-lg">This is the billing page.</p>
			<div className="mt-4 flex gap-2">{/* Add your billing related components here */}</div>
		</div>
	);
}
