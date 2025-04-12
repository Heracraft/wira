import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/index";
import { talentProfiles, workExperienceEntries, educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/store.server";

import TalentProfileProvider from "./profileProvider";
import SidebarLayout from "../SideBarLayout";

import type { TalentProfile } from "@/types";

const sections = [
	{
		label: "Personal Information",
		href: "/dashboard/talent/personal-info",
		completionProperty: "personalInfo",
	},
	{
		label: "Education & Experience",
		href: "/dashboard/talent/education&experience",
		completionProperty: "educationExperience",
	},
	{
		label: "Preferences",
		href: "/dashboard/talent/preferences",
		completionProperty: "preferences",
	},
	{
		label:"Assessment",
		href: "/dashboard/talent/assessment",
		completionProperty: "assessment",
	},
	{
		label: "Spotlight",
		href: "/dashboard/talent/spotlight",
		completionProperty: "spotlight",
	},
	{
		label: "Review & Submit",
		href: "/dashboard/talent/review&submit",
		completionProperty: "overallComplete",
	},
];

export default async function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		redirect("/unauthorized");
	}
	const uid = user.id;

	let talentProfile = null;
	let workExperience = null;
	let educationBackground = null;

	let profile: null | TalentProfile = null;

	try {
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
		redirect("/unauthorized");
	}

	return (
		<div className="flex h-full w-full flex-1 justify-center p-5 md:px-20 xl:px-36">
			{talentProfile && (
				<TalentProfileProvider profile={profile}>
					<SidebarLayout sections={sections}>{children}</SidebarLayout>
				</TalentProfileProvider>
			)}
		</div>
	);
}
