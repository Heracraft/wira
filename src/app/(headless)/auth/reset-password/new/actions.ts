"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/store.server";


export async function resetPassword(formData: { password: string }) {
    const supabase =await createClient();
    const { password } = formData;

    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        return { status: 400, message: error.message };
    }

    redirect ("/auth/");
}