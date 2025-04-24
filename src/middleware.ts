import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { createKv, stripeAdmin as stripe } from "@/lib/store.server";

import { isDev } from "@/lib/utils.server";

// const kv=createKv();
import { plans } from "@/lib/shared";

import { STRIPE_SUB_CACHE } from "@/types";

function redirectTo(path: string, request: NextRequest, searchParams?: URLSearchParams) {
	const url = request.nextUrl.clone();
	url.pathname = path;
	if (searchParams) {
		console.log("searchParams", searchParams.get("step"));
		searchParams.forEach((value, key) => {
			console.log(key, value);
			url.searchParams.set(key, value);
		});
	}
	return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request,
	});

	let supabaseResponse = response;
	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
				supabaseResponse = NextResponse.next({
					request,
				});
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
			},
		},
	});

	// Do not run code between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	// IMPORTANT: DO NOT REMOVE auth.getUser()

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// TODO: introduce rate limitng
	// TODO: allow users to access their own profile

	if (request.nextUrl.pathname === "/") {
		const url = request.nextUrl.clone();
		if (!url.searchParams.get("type") && user?.user_metadata.userType) {
			url.searchParams.set("type", user?.user_metadata.userType);
			supabaseResponse = NextResponse.rewrite(url);
		}
		return supabaseResponse;
	}

	if (request.nextUrl.pathname === "/auth" || request.nextUrl.pathname === "/pricing") {
		return supabaseResponse;
	}

	if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
		// no user & is not heading to auth page, potentially respond by redirecting the user to the login page
		return redirectTo("/auth", request);
	}

	// [x]: Reach metadata to check if onboarding is completed, else redirect to onboarding page
	// [ ]: Redirect to the verify email page if the user is not verified
	else if (!user?.user_metadata.isOnboarded && !request.nextUrl.pathname.startsWith("/onboarding") && !request.nextUrl.pathname.startsWith("/auth") && !request.nextUrl.pathname.startsWith("/admin")) {
		// user is verified but onboarding is not completed, redirect to the onboarding
		return redirectTo("/onboarding", request);
	}
	// if (user?.email_confirmed_at === null && !request.nextUrl.pathname.startsWith("/auth")) {
	// 	// user is not verified, redirect to the verify email page
	// 	const url = request.nextUrl.clone();
	// 	url.pathname = "/auth/verify-email";
	// 	return NextResponse.redirect(url);
	// }

	const toDashBoard = (user: User) => {
		let userType = user.user_metadata.userType;
		if (userType === "talent") {
			return redirectTo(`/dashboard/talent/personal-info`, request);
		} else if (userType === "employer") {
			return redirectTo(`/dashboard/employer/company-profile`, request);
		}
	};

	if (user && user?.user_metadata.isOnboarded) {
		// user is logged in and onboarding is completed
		// let userType = user.user_metadata.userType;

		if (request.nextUrl.pathname.startsWith("/auth")) {
			// redirect to dashboard if user is logged in and trying to access auth pages
			return toDashBoard(user);
		}

		if (request.nextUrl.pathname === "/dashboard") {
			// redirect to role-specific dashboard if user is logged in and trying to access dashboard using /dashboard
			return toDashBoard(user);
		}

		if (user?.user_metadata.userType == "employer" && (request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname == "/search")) {
			const redirectToChoosePlan = () =>
				redirectTo(
					"/onboarding",
					request,
					new URLSearchParams([
						["accountType", "employer"],
						["step", "2"],
					]),
				);

			const kv = createKv();
			const customerId = await kv.get(`${isDev ? "test-" : ""}stripe:customer:${user.id}`);
			// TODO: confirm subscription is real
			// in the future, when customers can cancel their subscription,
			if (!customerId) {
				return redirectToChoosePlan();
			}

			const subscription = (await kv.get(`${isDev ? "test-" : ""}stripe:subscription:${customerId}`)) as STRIPE_SUB_CACHE; // used to get from the stripe api but redis is faster

			if (!subscription || subscription.status == "none") {
				return redirectToChoosePlan();
			}

			if (request.nextUrl.pathname.startsWith("/profile")) {
				// the user is an employer, has a subscription and is trying to access a talent's full profile
				// confirm that they are within their subscription limits
				const currentMonth = new Date().getMonth() + "-" + new Date().getFullYear();

				const profilesViewedCountKey = `${isDev ? "test-" : ""}profile-views:${user.id}:${currentMonth}`;
				const profilesViewedCount = parseInt((await kv.get(profilesViewedCountKey)) || "0");

				if (profilesViewedCount < 5 && false) {
					// TODO: remove 'false'
					// the minimum number of profiles that can be viewed is 5 in the lowest tier
					// so allow the user to view the profile
					return supabaseResponse;
				}

				// get the current view limit for the user's subscription
				// TODO: look into when can priceId be null? Maybe if it is cancelled?
				
				const plan = isDev ? plans.find(plan=>plan.testPriceId === subscription.priceId): plans.find(plan=>plan.priceId === subscription.priceId);
				if (!plan) {
					return redirectTo("/errors/500", request);
				}
				const engagementLimit=plan.talentEngagementLimit
				if (!engagementLimit) {
					// the user has an enterprise plan, so they can view any number of profiles
					return supabaseResponse;
				}
				if (profilesViewedCount >= engagementLimit) {
					// the user has reached their limit, redirect to the pricing page
					return redirectTo("/pricing", request);
				}
				console.log("plan", engagementLimit);

			}
		}
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is.
	// If you're creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse;
}

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: ["/((?!_next/static|error|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
