import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";

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
				{children}
				{/* <Toaster richColors />  */}
				{/* Not expecting to create toasts in this route segment */}
				<GoogleAnalytics gaId="G-CP8CREK62S" />
			</body>
		</html>
	);
}
