import "server-only";

import { createKv, createClient } from "@/lib/store.server";
import { stripeAdmin as stripe } from "@/lib/store.server";

import { isDev } from "@/lib/utils.server";

import { plans } from "@/lib/shared";

import type { User } from "@supabase/supabase-js";
import type { STRIPE_SUB_CACHE } from "@/types";

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
		await kv.set(`${isDev ? "test-" : ""}stripe:subscription:${customerId}`, JSON.stringify(subData));
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
	await kv.set(`${isDev ? "test-" : ""}stripe:subscription:${customerId}`, JSON.stringify(subData));
	return subData;
}

export wasync function getPlanAndEngagementCount(user: User): Promise<{
	plan: (typeof plans)[number];
	profilesViewedCount: number;
}> {
	// returns the current plan and their engagement limit

	if (!user) {
		throw new Error("User not found");
	}
	if (user.user_metadata.userType !== "employer") {
		throw new Error("User is not an employer");
	}
	const uid = user.id;

	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);

	if (!customerId) {
		throw new Error("Customer not found");
	}
	const currentMonth = new Date().getMonth() + "-" + new Date().getFullYear();

	const profilesViewedCountKey = `${isDev ? "test-" : ""}profile-views:${uid}:${currentMonth}`;
	const subscriptionKey = `${isDev ? "test-" : ""}stripe:subscription:${customerId}`;

	const result = await kv.mget(subscriptionKey, profilesViewedCountKey);
	const subscription = result[0] as STRIPE_SUB_CACHE;
	const profilesViewedCount = parseInt((result[1] as string) || "0");

	// subscription as STRIPE_SUB_CACHE;

	if (!subscription || subscription.status == "none" || subscription.status == "canceled" || subscription.status == "incomplete") {
		throw new Error("Subscription not found");
	}

	const plan = isDev ? plans.find((plan) => plan.testPriceId === subscription.priceId) : plans.find((plan) => plan.priceId === subscription.priceId);
	if (!plan) {
		throw new Error("Plan not found");
	}
	return {
		plan,
		profilesViewedCount,
	};
}
