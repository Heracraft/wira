import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/index";
import { talentProfiles, workExperienceEntries, educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

import Sidebar from "../sidebar";
import TalentProfileProvider from "./profileProvider";

import type { TalentProfile } from "@/types/dashboard";

const sections = [
	{
		label: "Personal Information",
		href: "/dashboard/talent/personal-info",
	},
	{
		label: "Education & Experience",
		href: "/dashboard/talent/education&experience",
	},
	{
		label: "Preferences",
		href: "/dashboard/talent/preferences",
	},
	{
		label: "Review & Submit",
		href: "/dashboard/talent/review&submit",
	},
	// Account?: to edit email, password, avatar, etc.
];

export default async function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let talentProfile = null;
	let workExperience = null;
	let educationBackground = null;

	let profile: null | TalentProfile = null;

	try {
		const headersList = await headers();
		const uid = headersList.get("x-uid");

		let profileId;

		if (uid) {
			talentProfile = (await db.select().from(talentProfiles).where(eq(talentProfiles.userId, uid)))[0];
			profileId = talentProfile.profileId;
			workExperience = await db.select().from(workExperienceEntries).where(eq(workExperienceEntries.profileId, profileId));
			educationBackground = await db.select().from(educationEntries).where(eq(educationEntries.profileId, profileId));

			profile = { ...talentProfile, workExperience, education: educationBackground };
		} else {
			throw new Error("Unauthorized");
		}
	} catch (error) {
		console.log(error);
		// TODO: handle error properly
		redirect("/unathorized");
	}

	return (
		<>
			<Sidebar sections={sections} />
			{talentProfile && <TalentProfileProvider profile={profile}>{children}</TalentProfileProvider>}
		</>
	);
}
