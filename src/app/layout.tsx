import type { Metadata } from "next";
import { headers } from "next/headers";

import { GoogleAnalytics } from '@next/third-parties/google'

import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";

import Header from "@/components/Header";
import Footer from "@/components/footer";

import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Wira",
		template: "%s | Wira",
	},
	description: "Application for connecting talents and employers",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const pathname = headersList.get("x-pathname");

		// if (user.user_metadata.userType === "talent") {
		// 	const talentProfile = (await db.select().from(talentProfiles).where(eq(talentProfiles.userId, user.id)))[0];
		// 	// console.log({ talentProfile });
		// 	if (talentProfile) {
		// 		initialUserState.fullName = talentProfile.fullName as string;
		// 		initialUserState.avatarUrl = talentProfile.avatarUrl;
		// 		initialUserState.phoneNumber = talentProfile.phoneNumber;
		// 		initialUserState.dateOfBirth = talentProfile.dateOfBirth;
		// 	}
		// }
		// else if (user.user_metadata.userType === "employer") {
		// 	const companyProfile = (await db.select().from(companyProfiles).where(eq(companyProfiles.userId, user.id)))[0];
		// 	// console.log({ companyProfile });
		// 	if (companyProfile) {
		// 		initialUserState.companyName = companyProfile.companyName as string;
		// 		initialUserState.avatarUrl = companyProfile.avatarUrl;
		// 		initialUserState.fullName = companyProfile.contactPersonName;
		// 	}
		// }


	return (
		<html lang="en">
			<body className="flex h-[100dvh] font-Roboto flex-col overflow-x-hidden bg-neutral-50 antialiased">
				<Header />
				<AuthProvider />
				<div className="flex h-full flex-1 flex-col py-5">{children}</div>
				{pathname == "/" || !pathname && <Footer />}
				<Toaster richColors />
				<GoogleAnalytics gaId="G-CP8CREK62S"/>
			</body>
		</html>
	);
}
