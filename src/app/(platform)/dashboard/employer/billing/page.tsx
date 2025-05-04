import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { createKv, stripeAdmin as stripe, createClient } from "@/lib/store.server";

import { isDev } from "@/lib/utils.server";

import { Badge } from "@/components/ui/badge";
import {Card,CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { writeFile } from "fs";

export default async function Page() {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		redirect("/errors/401");
	}
	const uid = user.id;
	
	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);

	if (!customerId) {
		return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
	}

	const subscriptions = await stripe.subscriptions.list({
		customer: customerId as string, // Pass the customer ID
		limit: 1, // Fetch only the most recent subscription
	});

	if (!subscriptions.data.length) {
		return new Response(JSON.stringify({ error: "No subscriptions found for this customer" }), { status: 404 });
	}

	const subscription = subscriptions.data[0];

	const productId = subscription.items.data[0].price.product as string;
	const product = await stripe.products.retrieve(productId);

	return (
		<div className="flex w-full flex-1 flex-col gap-5">
			<div>
				<h3 className="text-lg font-semibold">Billing & Subscription</h3>
				<p className="text-sm text-muted-foreground">Manage your subscription plan, payment methods, and billing history.</p>
			</div>
			<div className="flex w-full max-w-md items-start justify-between rounded border p-2">
				<span className="">
					<h4>
						Current Plan: <b className="font-semibold">{product.name}</b>
					</h4>
					<p className="text-sm text-muted-foreground">Your plan renews on {format(new Date(subscription.current_period_end*1000), "MMMM do, yyyy")}</p>
				</span>
				<Badge variant="outline" className="bg-green-50 text-green-600">
					{subscription.status == "trialing" ? "Trial" : subscription.status == "active" ? "Active" : "Inactive"}
				</Badge>
			</div>
		</div>
	);
}
