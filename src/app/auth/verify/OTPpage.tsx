// Not in use yet, but this is the OTP page for the auth flow.

"use client";

import { useState, useEffect, use } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { cn, formatSecondsToMinSec } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

function ResendCountdown() {
	// the constant re-renders (every second) are causing performance issues
	// React 🤦. shitty framework for stuff like this.

	let countDownDuration = 300;

	let [countDown, setCountDown] = useState(countDownDuration);

	useEffect(() => {
		let oneSecInterval = setInterval(() => {
			if (countDown == 0) return;
			setCountDown((prevCount) => {
				if (prevCount > 0) {
					return prevCount - 1;
				} else {
					return 0;
				}
			});
		}, 1000);

        // clear interval after 5 minutes (300 seconds) (the countdown duration)
		setTimeout(() => {
			clearInterval(oneSecInterval);
			console.log("Interval cleared");
		}, countDownDuration * 1000);
	}, []);
	if (countDown == 0) return null;
	if (countDown > 0)
		return (
			<p className="text-muted-foreground">
				Didn't receive the code?{" "}
				<a href="#" className="text-primary font-bold">
					Resend in {formatSecondsToMinSec(countDown)}
				</a>
			</p>
		);
	/* TODO: implement resending code */
	if (countDown == 0)
		return (
			<p>
				Didn't receive the code?{" "}
				<a href="#" className="text-primary font-bold">
					Resend
				</a>
			</p>
		);
}

export default function page() {
	return (
		<div className="flex w-full h-full justify-center items-center">
			<div className="flex flex-col gap-6 max-w">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Check your email :)</CardTitle>
						<CardDescription>Enter the 6-digit verification code that was sent to your email adress.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 items-center">
						<InputOTP maxLength={6}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
							</InputOTPGroup>
							<InputOTPSeparator />
							<InputOTPGroup>
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</CardContent>
					<CardFooter className="flex flex-col gap-2 text-sm">
						<Button className="w-full">Verify</Button>
						<ResendCountdown />
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
