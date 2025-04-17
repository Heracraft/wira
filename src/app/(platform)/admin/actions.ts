"use server"

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { adminClient } from "@/lib/store.server";
const supabase = adminClient();

export async function resetUser(userId: string, userType: string) {
	await supabase.auth.admin.updateUserById(userId, {
		user_metadata: {
			isOnboarded: false,
		},
	});

	// await db.delete(users).where(eq(users.userId, userId));

    revalidatePath("/admin");
}
