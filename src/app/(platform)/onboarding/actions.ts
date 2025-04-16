"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db/index";
import { users, talentProfiles, companyProfiles } from "@/db/schema";

import { adminClient } from "@/lib/store.server";

export async function onBoardTalent(userId: string, profileData: { email: string; fullName: string; phoneNumber: string; dateOfBirth: string }) {
	const client = adminClient();
	try {
		const { email, fullName, phoneNumber, dateOfBirth } = profileData;

		await client.auth.admin.updateUserById(userId, {
			user_metadata: {
				userType: "talent",
				isOnboarded: true,
			},
		});

		await db.insert(users).values({
			userId,
			userType: "talent",
			email,
		});

		await db.insert(talentProfiles).values({
			userId: userId,
			fullName: fullName,
			phoneNumber,
			dateOfBirth,
		});

		return { status: 200 };
	} catch (error: any) {
		console.log("errorrrr",error);

		return { status: 400, message: "something went wrong. try again" };
	}
}

export async function onBoardCompany(userId: string, profileData: { email: string; companyName: string; contactPersonName: string; contactPersonPosition: string; companyWebsite: string; industry: string }) {
	const client = adminClient();
	try {
		const { email, companyName, contactPersonName, contactPersonPosition, companyWebsite, industry } = profileData;

		await client.auth.admin.updateUserById(userId, {
			user_metadata: {
				userType: "employer",
				isOnboarded: true,
			},
		});

		await db.insert(users).values({
			userId,
			userType: "employer",
			email,
		});

		await db.insert(companyProfiles).values({
			userId,
			companyName,
			contactPersonName,
			contactPersonPosition,
			companyWebsite,
			industry,
		});

		revalidatePath("/", "layout");

		return { status: 200 };
	} catch (error: any) {
		return { status: 400, message: error.message };
	}
}
