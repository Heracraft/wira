import { type NextRequest } from "next/server";

import { redirect } from "next/navigation";

// hacky but what can you do
// supabase does not support redirects with query params
export async function GET(request: NextRequest, { params }: { params: Promise<undefined | { next: string[] }> }) {
	const passedParams=await params
	if (!passedParams) {
		redirect("/onboarding");
	}

	const next = (passedParams).next;
	if (!next) {
		redirect("/onboarding");
	}

	const [accountType, plan] = next;

	let continueUrl = "/onboarding";

	if (accountType) {
		continueUrl += `?account-type=${accountType}`;
	}

	if (plan) {
		continueUrl += `&plan=${plan}`;
	}

	console.log({ continueUrl });
	
	redirect(continueUrl);
}
