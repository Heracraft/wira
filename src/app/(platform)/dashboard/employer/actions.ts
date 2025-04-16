"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { talentProfiles, workExperienceEntries, educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

// TODO: implement server side validation

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export async function updateTalentProfile(data: Record<string, any>, userId: string) {
	try {
		console.log({ data });

		let workExperience, education;
		if (data.workExperience && data.workExperience.length > 0) {
			workExperience = data.workExperience;
			delete data.workExperience;
		}
		if (data.education && data.education.length > 0) {
			education = data.education;
			delete data.education;
		}

		const { profileId } = (await db.update(talentProfiles).set(data).where(eq(talentProfiles.userId, userId)).returning({ profileId: talentProfiles.profileId }))[0];

		if (workExperience) {
			console.log("work exp", workExperience);

			workExperience = workExperience.map((we: any) => ({ ...we, profileId })); // add profileId to each work experience entry
			await db.delete(workExperienceEntries).where(eq(workExperienceEntries.profileId, profileId)); // delete all existing work experience entries for this profile
			await db.insert(workExperienceEntries).values(workExperience);
		}

		if (education) {
			console.log("education", education);
			education = education.map((ed: any) => ({ ...ed, profileId })); // add profileId to each education entry
			await db.delete(educationEntries).where(eq(educationEntries.profileId, profileId)); // delete all existing education entries for this profile
			await db.insert(educationEntries).values(education);
		}

		revalidatePath("/dashboard/talent","layout"); // revalidate the path to reflect the updated data

		return { status: 200, message: "Profile updated successfully" };
	} catch (error) {
		console.log("awddwa", error);
		return { status: 400, message: "Something went wrong" };
	}
}

export async function submitFeedback(data: Record<string, any>) {
	// This function is used to submit feedback through the server to discord
	try {
		if (!DISCORD_WEBHOOK_URL) {
			console.error("Discord webhook URL is not set");
			throw new Error("Discord webhook URL is not set");
		}
		let res = await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content:
					"New feedback submitted:\n" +
					"\n" +
					// You can customize the message format as per your needs
					`**User ID:** ${data.uid || "Not provided"}\n` +
					`**Submitted At:** ${new Date().toISOString()}\n` +
					`**Page:** Talent dashboard - Review & Submit` +
					"\n" +
					`**How did you hear about us?:** ${data.hearAboutUs || "Not provided"}\n` +
					`**Feedback:** ${data.feedback || "No feedback provided"}`,
				// You can customize the content as per your needs
			}),
		});
		console.log(res);
		if (!res.ok) {
			console.error("Failed to send feedback to Discord:", res.statusText);
			throw new Error("Failed to send feedback");
		}

		return { status: 200, message: "Feedback submitted successfully" };
	} catch (error) {
		return { status: 500, message: "Failed to submit feedback" };
	}
}
