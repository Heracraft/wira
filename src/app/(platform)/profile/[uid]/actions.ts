"use server"

import { db } from "@/db/";
import { waitlist } from "@/db/schema";

import { revalidatePath } from "next/cache";


export async function addToWaitlist(employerId: string, talentId: number) {
	// employerId: uid of the employer
    // talentId: profileId of the talent
    // Check if the employerId and talentId are valid
	try {
		await db.insert(waitlist).values({
			employerId,
			talentId,
		});
		revalidatePath("/profile/[uid]", "page");
        return { status: 200, message: "Added to waitlist" };
	} catch (error) {
		console.error("Error adding to waitlist:", error);
		return { status: 500, message: "Error adding to waitlist" };
	}
}
