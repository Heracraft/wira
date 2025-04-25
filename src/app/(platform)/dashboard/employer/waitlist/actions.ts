"use server";
import { revalidatePath } from "next/cache";

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { waitlist, talentProfiles, users } from "@/db/schema";

export async function removeFromWaitlist(waitlistId: number, employerId: string) {
    try {
        // Remove the waitlist entry from the database
        await db.delete(waitlist).where(and(eq(waitlist.waitlistId, waitlistId), eq(waitlist.employerId, employerId)));

        // console.log("Removed from waitlist successfully");
        revalidatePath("/dashboard/employer/waitlist", "page");
        return {status:200}        
    } catch (error) {
        console.error("Error removing from waitlist:", error);
        throw new Error("Failed to remove from waitlist");
    }

}