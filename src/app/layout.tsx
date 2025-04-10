import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";

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
	return (
		<html lang="en">
			<body className="flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden bg-neutral-50 font-Roboto antialiased">
				<Header />
				<AuthProvider />
				<div className="flex h-full flex-1 flex-col py-5">
					{children}
					<Footer />
				</div>
				<Toaster richColors />
				<GoogleAnalytics gaId="G-CP8CREK62S" />
			</body>
		</html>
	);
}
