import { NextRequest } from "next/server";

import { stripeAdmin as stripe, createKv, createClient } from "@/lib/store.server";
import { redirect } from "next/navigation";

import {isDev} from "@/lib/utils.server"

//const isDev = process.env.NODE_ENV === "development";



export async function GET(request: NextRequest) {
	const supabase = await createClient();
	const kv = createKv();

	const selectedPlan = request.nextUrl.searchParams.get("plan") || "Essential Plan";

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response(JSON.stringify({ error: "User not found" }), { status: 401 });
	}

	let customer = await kv.get(`${isDev?"test-":""}stripe:customer:${user.id}`);

	if (!customer) {
		const newCustomer = await stripe.customers.create({
			email: user.email,
			metadata: {
				user_id: user.id,
			},
		});
		await kv.set(`${isDev ? "test-" : ""}stripe:customer:${user.id}`, newCustomer.id);
		customer = newCustomer.id;
	}

	// Line 34 - 52: Very hacky way to get the product id. Ideally it should come from in withthe request
	const products = await stripe.products.list({
		type: "service",
	});

	let selectedProduct = products.data.find((product) => product.name === selectedPlan + " Plan");
	if (!selectedProduct) {
		return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
	}

	const prices = await stripe.prices.list({
		product: selectedProduct.id,
		active: true,
	});

	if (!prices.data.length) {
		return new Response(JSON.stringify({ error: "No prices found for the selected product" }), { status: 404 });
	}

	const selectedPrice = prices.data[0];
	const priceId = selectedPrice.id;

	// const selectedProduct

	const checkout = await stripe.checkout.sessions.create({
		customer: customer as string,
		mode: "subscription",
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		subscription_data: {
			trial_period_days: 30,
		},
		success_url: `${request.nextUrl.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${request.nextUrl.origin}/subscription/failure?session_id={CHECKOUT_SESSION_ID}`,
	});

	if (!checkout) {
		return new Response(JSON.stringify({ error: "Checkout session not created" }), { status: 500 });
	}

	if (checkout.url) {
		redirect(checkout.url);
	}
}
