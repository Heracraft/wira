import "server-only";

import { createKv, createClient } from "@/lib/store.server";
import { stripeAdmin as stripe } from "@/lib/store.server";

import {isDev} from "@/lib/utils.server"


//const isDev = process.env.NODE_ENV === 'development';
// const isDev=true

// The contents of this function should probably be wrapped in a try/catch
export async function syncStripeDataToKV(customerId: string) {
	const kv = createKv();

	// Fetch latest subscription data from Stripe
	const subscriptions = await stripe.subscriptions.list({
		customer: customerId,
		limit: 1,
		status: "all",
		expand: ["data.default_payment_method"],
	});

	if (subscriptions.data.length === 0) {
		const subData = { status: "none" };
		await kv.set(`${isDev?"test-":""}stripe:subscription:${customerId}`, JSON.stringify(subData));
		return subData;
	}

	const subscription = subscriptions.data[0];

	// Store complete subscription state
	const subData = {
		subscriptionId: subscription.id,
		status: subscription.status,
		priceId: subscription.items.data[0].price.id,
		currentPeriodEnd: subscription.current_period_end,
		currentPeriodStart: subscription.current_period_start,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		paymentMethod:
			subscription.default_payment_method && typeof subscription.default_payment_method !== "string"
				? {
						brand: subscription.default_payment_method.card?.brand ?? null,
						last4: subscription.default_payment_method.card?.last4 ?? null,
					}
				: null,
	};

	// Store the data in your KV
	await kv.set(`${isDev?"test-":""}stripe:subscription:${customerId}`, JSON.stringify(subData));
	return subData;
}


async function getCurrentPlan() {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		throw new Error("User not found");
	}
	const uid = user.id;

	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);

	if (!customerId) {
		throw new Error("Customer not found");
	}

	const subscriptions = await stripe.subscriptions.list({
		customer: customerId as string, // Pass the customer ID
		limit: 1, // Fetch only the most recent subscription
	});

	if (!subscriptions.data.length) {
		throw new Error("No subscriptions found for this customer");
	}

	const subscription = subscriptions.data[0];

	const productId = subscription.items.data[0].price.product as string;
	const product = await stripe.products.retrieve(productId);

	return product
}