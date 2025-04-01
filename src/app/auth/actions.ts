"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/store.server";

// TODO: Integrate zod for validation

export async function login(credentials: { email: string; password: string }) {
	const { email, password } = credentials;

	const supabase = await createClient();

	const data = {
		email,
		password,
	};

	console.log({ data });

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		// redirect("/error");
		return { status: 400, message: error.message };
	}

	// TODO:  bug fixed in https://github.com/vercel/next.js/pull/70715. Update next.js.
	// TODO: the redirect is caught as an error on the client. ingore the error.
	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: { email: string; password: string }) {
	const supabase = await createClient();

	const { email, password } = formData;

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				isOnboarded: false,
			},
			// emailRedirectTo: `/onboarding`,
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
export async function revalidatePathFromClient(path: string, layout?: boolean) {
	try {
		if (layout) {
			revalidatePath(path, "layout");
		} else {
			revalidatePath(path);
		}
		return { status: 200, message: `Path '${path}' revalidated successfully.` };
	} catch (error) {
		console.error("Failed to revalidate path:", error);
		return { status: 500, message: "Failed to revalidate path." };
	}
}
