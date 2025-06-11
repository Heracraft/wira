"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/lib/store";

import { Loader2 } from "lucide-react";

export default function page() {
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isVerificationSent, setIsVerificationSent] = useState(false);

	if (isVerificationSent) {
		return (
			<div className="flex h-full w-full flex-1 items-center justify-center">
				<div className="flex w-full max-w-sm flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Check your email :)</CardTitle>
							<CardDescription>We have sent you a link to reset your password.</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Reset your password</CardTitle>
						<CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							<Label htmlFor="email" className="text-sm font-medium">
								Email
							</Label>
							<Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" required />
						</div>
						<Button
							className="mt-4 flex w-full items-center justify-center gap-2"
							onClick={async () => {
								setIsLoading(true);
								setError(null);
								if (!email) {
									setError("Please enter your email");
									setIsLoading(false);
									return;
								}
								const { error } = await supabase.auth.resetPasswordForEmail(email, {
									redirectTo: `${window.location.origin}/auth/reset-password/new`,
								});
								if (error) {
									setError(error.message);
								}
								setIsLoading(false);
								setIsVerificationSent(true);
							}}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="animate-spin" />
									<span>Loading...</span>
								</>
							) : (
								"Send reset password link"
							)}
						</Button>
						{error && <p className="mt-2 text-xs text-destructive">{error}</p>}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
