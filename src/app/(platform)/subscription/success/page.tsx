// update auth metadata
// update db
import Link from "next/link";

import { headers } from "next/headers";

import { createKv } from "@/lib/store.server";

import { syncStripeDataToKV } from "@/app/api/stripe/helpers";

import { Button } from "@/components/ui/button";

import {isDev} from "@/lib/utils.server"

// const isDev = process.env.NODE_ENV === "development";


export default async function Page() {
	const headersList = await headers();
	const uid = headersList.get("x-uid");

	const kv = createKv();

	const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${uid}`);
	if (!customerId) {
		return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
	}

	await syncStripeDataToKV(customerId);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<h1 className="text-3xl font-bold">Subscription Success</h1>
			<p className="mt-4 text-lg">Your subscription was successful!</p>
			<div className="mt-4 flex gap-2">
				<Link href="/dashboard">
					<Button size={"lg"}>
						Go to Dashboard
					</Button>
				</Link>
				<Link href="/dashboard/employer/billing">
					<Button variant="outline" size={"lg"}>
						Manage Subscription
					</Button>
				</Link>
			</div>
		</div>
	);
}
