import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/index";
import { companyProfiles, CompanyProfileRow } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/store.server";

import CompanyProfileProvider from "./profileProvider";
import SidebarLayout from "../SideBarLayout";

const sections = [
	{
		label: "Waitlist",
		href: "/dashboard/employer/waitlist",
	},
	{
		label: "Company Profile",
		href: "/dashboard/employer/company-profile",
	},
	{
		label: "Billing",
		href: "/dashboard/employer/billing",
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

	let companyProfile = null;

	let profile: null | CompanyProfileRow = null;

	try {
		companyProfile = (await db.select().from(companyProfiles).where(eq(companyProfiles.userId, uid)))[0];
		// profileId = companyProfile.profileId;

		profile = companyProfile;
	} catch (error) {
		console.log(error);
		redirect("/unauthorized");
	}

	return (
		<div className="flex h-full w-full flex-1 justify-center p-5 md:px-20 xl:px-36">
			{profile && (
				<CompanyProfileProvider profile={profile}>
					<SidebarLayout sections={sections}>{children}</SidebarLayout>
				</CompanyProfileProvider>
			)}
		</div>
	);
}
