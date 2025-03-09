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

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		// redirect("/error");
		return { status: 400, message: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: { email: string; password: string }) {
	const supabase = await createClient();

	const { email, password } = formData;

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options:{
			data:{
				isOnboarded: false
			}
		}
	});

	if (error) {
		return { status: 400, message: error.message };
	}

	// revalidatePath("/", "layout");
	return { status: 200 };
}
