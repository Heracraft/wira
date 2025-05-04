// Server component that fetches user profile data and displays a user menu with options
import Link from "next/link";

import { Suspense } from "react";

import { db } from "@/db/index";
import { talentProfiles, companyProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/store.server";

import { SignOutDropdownItem } from "./Navbar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// import ProfileCompletionBadge from "./ProfileCompletionBadge"; //archived: extra request to fetch profile completion status for no reason

import { AlertTriangle } from "lucide-react";

import type { ProfileCompletion } from "@/types";

export default async function UserMenu() {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();

	if (!user) return null;

	const userId = user.id;
	const userType = user.user_metadata.userType as "talent" | "employer";
	let profile: {
		fullName: string;
		avatarUrl: string;
		companyName?: string;
		isProfileComplete?: boolean;
	} | null = null;

	if (userType === "talent") {
		const talentProfile = (await db.select().from(talentProfiles).where(eq(talentProfiles.userId, userId)))[0];
		// console.log({ talentProfile });
		if (talentProfile) {
			profile = {
				fullName: talentProfile.fullName as string,
				avatarUrl: talentProfile.avatarUrl as string,
				isProfileComplete: (talentProfile.profileCompletionStatus as ProfileCompletion).overallComplete,
			};
		}
	} else if (userType === "employer") {
		const companyProfile = (await db.select().from(companyProfiles).where(eq(companyProfiles.userId, userId)))[0];
		// console.log({ companyProfile });
		if (companyProfile) {
			profile = {
				fullName: companyProfile.contactPersonName as string,
				avatarUrl: companyProfile.avatarUrl as string,
				companyName: companyProfile.companyName as string,
			};
		}
	}
	return (
		<>
			{profile ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src={profile.avatarUrl || undefined} />
							<AvatarFallback>
								{profile.fullName
									.split(" ")
									.map((el) => el[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-44">
						<DropdownMenuLabel className="flex flex-col">
							{profile.fullName}
							{userType == "employer" && <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">{profile.companyName}</span>}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							{/* If their profile is complete, they can view it as an employer would otherwise they are taken to the dashboard */}
							{/* If you don't like this behaviour, simply remove this DropdownItem */}
							<Link href={profile.isProfileComplete ? `/profile/${user.id}` : `/dashboard`}>
								Profile
								{userType === "talent" && !profile.isProfileComplete && <span className="ml-auto h-fit rounded bg-yellow-100 px-2 text-[12px] font-semibold text-yellow-800">incomplete</span>}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/dashboard/${userType}/settings`}>Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{/* Signout Item goes here*/}
						<SignOutDropdownItem />
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className="grid size-10 place-content-center rounded-lg bg-destructive">
					<AlertTriangle className="text-white" />
				</div>
			)}
		</>
	);
}
