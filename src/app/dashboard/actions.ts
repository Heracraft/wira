"use server";

import { db } from "@/db";
import { talentProfiles, workExperienceEntries, educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

// TODO: implement server side validation

export async function updateTalentProfile(data: Record<string, any>, userId: string) {
	try {
		console.log({data});
		

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

		return { status: 200, message: "Profile updated successfully" };
	} catch (error) {
		console.log("awddwa",error);
		return { status: 400, message: "Something went wrong" };
	}
}
