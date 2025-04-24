import "server-only";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
// import Redis from "ioredis";
import { Redis } from "@upstash/redis";
import Stripe from "stripe";
import { createClient as createSanityClient } from "next-sanity";

import { isDev } from "@/lib/utils.server";

// exports server only clients

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
}

export function adminClient() {
	return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

export function createKv() {
	// return new Redis(process.env.REDIS_URL!); //old: ioredis.
	
	return new Redis({
		url: process.env.REDIS_HOST!,
		token: process.env.REDIS_TOKEN!,
		// REDIS_CONNECTION_URL="https://just-killdeer-50042.upstash.io"
		// REDIS_TOKEN="AcN6AAIjcDEwN2IyZTUyNDNhYjk0YmZmYTIzOTMzNGFjNmVlZTY0ZHAxMA"
	});
}

export const sanityClient = createSanityClient({
	projectId: process.env.SANITY_PROJECT_ID,
	dataset: process.env.SANITY_DATASET,
	apiVersion: "2021-03-25",
	useCdn: process.env.NODE_ENV === "production",
});

//const isDev = process.env.NODE_ENV === 'development';
const stripeSecretKey = isDev ? process.env.STRIPE_TEST_SECRET_KEY : process.env.STRIPE_SECRET_KEY;

export const stripeAdmin = new Stripe(stripeSecretKey!);
