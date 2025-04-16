import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";

import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";

import Header from "@/components/Header";

import "../globals.css";

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
	return (
		<html lang="en">
			<body className="bg-neutral-50 font-Roboto antialiased">
				<AuthProvider />
				<main className="flex flex-col overflow-x-hidden overflow-y-auto h-[100dvh]">
					<Header />
					{children}
					{/* <Footer /> -- Not needed in platform pages */}
				</main>
				<Toaster richColors />
				<GoogleAnalytics gaId="G-CP8CREK62S" />
			</body>
		</html>
	);
}
