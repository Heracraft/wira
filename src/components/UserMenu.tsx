// Server component that fetches user profile data and displays a user menu with options
import Link from "next/link";

import { db } from "@/db/index";
import { talentProfiles, companyProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/store.server";

import { SignOutDropdownItem } from "./Navbar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { AlertTriangle } from "lucide-react";

export default async function UserMenu() {
	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();

	if (!user) return null;

	// TODO: make this fetchcall not return null immediately after signing in
	const userId = user.id;
	const userType = user.user_metadata.userType as "talent" | "employer";
	let profile: {
		fullName: string;
		avatarUrl: string;
		companyName?: string;
	} | null = null;

	if (userType === "talent") {
		const talentProfile = (await db.select().from(talentProfiles).where(eq(talentProfiles.userId, userId)))[0];
		// console.log({ talentProfile });
		if (talentProfile) {
			profile = {
				fullName: talentProfile.fullName as string,
				avatarUrl: talentProfile.avatarUrl as string,
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
							<Link href={`/dashboard`}>Profile</Link>
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
