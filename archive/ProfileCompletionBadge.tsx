// I dont know what i was thinking when i wrote this component
// The parent component is a server component that fetches user profile data and displays a user menu with options
// The profile data fetched in the parent already includes the profile completion status
// :facepalm:

// ARCHIVED 

import { redirect } from "next/navigation";

import { db } from "@/db/index";
import { talentProfiles, workExperienceEntries, educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/store.server";
import { ProfileCompletion } from "@/types";

import { Badge } from "@/components/ui/badge";

export default async function ProfileCompletionBadge() {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		redirect("/unauthorized");
	}
	const uid = user.id;
	if (!uid) {
		return null;
	}
    // Notice how we are selecting the full row not just the profile completion status
    // This is because Next.js dedupes identical requests
    // And this row is fetched multiple times before this badge is rendered
    // So for cache to be hit we need to select the full row
	const talentProfile = (await db.select().from(talentProfiles).where(eq(talentProfiles.userId, uid)))[0];
	if (!talentProfile) {
		return null;
	}
	const profileCompletionStatus = talentProfile?.profileCompletionStatus as ProfileCompletion;

	if (!profileCompletionStatus.overallComplete) {
		return <span className="ml-auto text-[12px] bg-yellow-100 text-yellow-800 font-semibold px-2 h-fit rounded" >incomplete</span>;
	}
}
