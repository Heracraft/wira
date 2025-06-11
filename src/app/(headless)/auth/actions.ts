"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/store.server";

// FUTURE: Integrate zod for validation

export async function login(credentials: { email: string; password: string }) {
	// Not used anymore. Logging the user right in the browser (client) seemed to be a better option.
	// Mainly because it triggered onAuthStateChanged more relibly and it avoids an etra fetch step
	// that seemed pointless 
	const { email, password } = credentials;

	const supabase = await createClient();

	const data = {
		email,
		password,
	};

	console.log({ data });

	const {
		error,
		data: { user },
	} = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { status: 400, message: error.message };
	}

	if (user) {
		if (!user?.user_metadata?.isOnboarded) {
			redirect("/onboarding");
		}
		if (user.user_metadata?.userType) {
			let userType = user.user_metadata.userType;
			if (userType === "talent") {
				return redirect(`/dashboard/talent/personal-info`);
			} else if (userType === "employer") {
				return redirect(`/search`);
			}
		}
	} else {
		return { status: 400, message: "User not found" };
	}
}

export async function signup(formData: { email: string; password: string }, continueUrl?: string) {
	const supabase = await createClient();

	const { email, password } = formData;

	console.log({ continueUrl });

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				isOnboarded: false,
			},
			emailRedirectTo: continueUrl,
		},
	});

	if (error) {
		return { status: 400, message: error.message };
	}

	// revalidatePath("/", "layout");
	return { status: 200 };
}

/**
 * Server action to revalidate a specific path.
 * @param path - The path to revalidate.
 */
export async function revalidatePathFromClient(path: string, type?: "layout" | "page") {
	try {
		revalidatePath(path, type);
		return { status: 200, message: `Path '${path}' revalidated successfully.` };
	} catch (error) {
		console.error("Failed to revalidate path:", error);
		return { status: 500, message: "Failed to revalidate path." };
	}
}
