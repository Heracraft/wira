import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { createKv } from "@/lib/store.server";

// const kv=createKv();

function redirectTo(path: string, request: NextRequest) {
	const url = request.nextUrl.clone();
	url.pathname = path;
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

	if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/auth" || request.nextUrl.pathname === "/pricing") {
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
