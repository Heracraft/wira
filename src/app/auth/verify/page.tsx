"use client";

import Link from "next/link";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2, BadgeCheck } from "lucide-react";

export default function page() {
	const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");

	useEffect(() => {
		setTimeout(() => {
			setVerificationStatus("success");
		}, 2000);
	}, []);

	return (
		<div className="flex w-full h-full justify-center items-center">
			<div className="flex flex-col gap-6 max-w-md w-full">
				<Card>
					<CardHeader className="text-center items-center">
						{verificationStatus == "loading" && <Loader2 className="animate-spin" size={48} />}
						{verificationStatus == "success" && <BadgeCheck size={48} />}
						<h3 className="text-xl">{"{username}"}</h3>
						<CardTitle className="text-3xl">
							{verificationStatus == "loading" && "Verifying email"}
							{verificationStatus == "success" && "We have verified your email"}
						</CardTitle>
						{verificationStatus == "loading" && <CardDescription>Just a moment...</CardDescription>}
						{verificationStatus == "success" && <CardDescription>Now you can finish setting up your account</CardDescription>}
					</CardHeader>
					<CardContent>
						<Button asChild disabled={verificationStatus != "success"} className="w-full">
							<Link href="/auth/onboarding">Continue</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
