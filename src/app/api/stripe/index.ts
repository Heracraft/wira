// stripe webhook
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";

import Stripe from "stripe";

import { syncStripeDataToKV } from "@/app/api/stripe/helpers";
import { stripeAdmin as stripe } from "@/lib/store.server";

import {isDev} from "@/lib/utils.server"


//const isDev = process.env.NODE_ENV === 'development';
// const isDev=true
const stripeWebhookSecret = isDev ? process.env.STRIPE_TEST_SECRET_KEY : process.env.STRIPE_SECRET_KEY;

export const config = {
	api: {
		bodyParser: false,
	},
};

const cors = Cors({
	allowMethods: ["POST", "GET"],
});

async function webhookHandler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method == "POST") {
		const buff = await buffer(request);
		const signature = request.headers["stripe-signature"];
		if (!signature) {
			return response.status(400).send("No stripe signature");
		}
		try {
			const event = stripe.webhooks.constructEvent(buff.toString(), signature, stripeWebhookSecret!);

			if (!allowedEvents.includes(event.type)) return; // Ignore events that are not in the allowed list

			const { customer: customerId } = event?.data?.object as {
				customer: string;
			};
		
			if (typeof customerId !== "string") {
				throw new Error(`[STRIPE WEBHOOK]ID isn't string.\nEvent type: ${event.type}`);
			}
		
			await syncStripeDataToKV(customerId);

		} catch (error) {
			console.log(`[STRIPE WEBHOOK] Error processing event: ${error}`);
		}
		return response.json({ received: true });
	}
}

export default cors(webhookHandler as any);

const allowedEvents: Stripe.Event.Type[] = [
	"checkout.session.completed",
	"customer.subscription.created",
	"customer.subscription.updated",
	"customer.subscription.deleted",
	"customer.subscription.paused",
	"customer.subscription.resumed",
	"customer.subscription.pending_update_applied",
	"customer.subscription.pending_update_expired",
	"customer.subscription.trial_will_end",
	"invoice.paid",
	"invoice.payment_failed",
	"invoice.payment_action_required",
	"invoice.upcoming",
	"invoice.marked_uncollectible",
	"invoice.payment_succeeded",
	"payment_intent.succeeded",
	"payment_intent.payment_failed",
	"payment_intent.canceled",
];
