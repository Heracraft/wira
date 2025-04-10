"use client";

import Link from "next/link";
import { revalidatePath } from "next/cache";
import { useSearchParams } from "next/navigation";

// import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

import { useForm, SubmitHandler, Controller, set } from "react-hook-form";

import { maskEmail } from "@/lib/utils";

// import { signup, verifyEmail } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Info } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import SubmitButton from "@/components/submitButton";

import { signup } from "../actions";

export default function page() {
	// const searchParams = useSearchParams();

	// const continueUrl = searchParams.get("continueUrl") || "/auth";

	// const plan = searchParams.get("plan") || "Essential"; // Do we need this?

	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
		watch,
		control,
		reset,
	} = useForm();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		// let res = await signup({
		// 	username: data.username,
		// 	email: data.email,
		// 	phone: data.phoneNumber,
		// 	password: data.password,
		// });
		// console.log(res);
		// if (res.status == 200) {
		// 	// let email = data.email;
		// 	// await verifyEmail(email);
		// 	setIsVerificationCodeSent(true);
		// } else {
		// 	setErrorOccured(true);
		// }

		let res = await signup({
			email: data.email,
			password: data.password,
		});

		if (res.status == 200) {
			setIsVerificationCodeSent(true);
		} else {
			setError({ status: true, message: res.message as string});
			setTimeout(() => {
				reset();
				setError({ status: false, message: "" });
			}, 10000);
		}
	};

	if (!isVerificationCodeSent) {
		return (
			<div className="flex h-full w-full flex-1 items-center justify-center">
				<div className="flex max-w-md flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Create your Wira account</CardTitle>
							<CardDescription className="flex w-full justify-center gap-1">
								<p>Already have an account?</p>
								<Link href="/auth" className="underline underline-offset-4">
									Login
								</Link>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
								<div className="grid gap-5">
									{/* <div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input {...register("username", { required: true })} id="username" type="text" placeholder="John" />
										{errors.username && (
											<span role="alert" className="text-muted-foreground text-xs">
												A username is required
											</span>
										)}
									</div> */}
									<div className="grid gap-2">
										<Label htmlFor="email">Email address</Label>
										<Input className="text-sm" {...register("email", { required: "An email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" } })} id="email" type="email" placeholder="m@example.com" />
										{/* {errors.email && <span role="alert">{errors.email.message}</span>} */}
										{errors.email && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.email.message as string}
											</span>
										)}
									</div>

									<div className="flex w-full flex-col gap-2">
										<Label htmlFor="password">Password</Label>
										<PasswordInput className="text-sm" id="password" autoComplete="new-password" hideRequirements hideStrength value={watch("password") || ""} {...register("password", { required: "A password is required", pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, message: "Password must have 8+ characters, including a number, an uppercase letter, a lowercase letter, and a special character (!@#$)." } })} />
										{errors.password && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.password.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="confirmPassword">Confirm password</Label>
										<PasswordInput
											className="text-sm"
											{...register("confirmPassword", {
												required: "Confirm Password is required",
												validate: (value) => value === watch("password") || "Passwords do not match",
											})}
											hideRequirements
											hideStrength
											autoComplete="new-password"
										/>
										{errors.confirmPassword && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.confirmPassword.message as string}
											</span>
										)}
										{/* <p className="text-xs text-muted-foreground">Passwords do not match</p> */}
									</div>
									<SubmitButton
										buttonState={{
											isSubmitted,
											isSubmitting,
											isSubmitSuccessful,
											isValid,
										}}
										loadingText="creating your account"
									>
										Register
									</SubmitButton>
									{error.status && <p className="w-full text-center text-xs text-destructive">{error.message}</p>}
								</div>
							</form>
						</CardContent>
					</Card>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
						By clicking register, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex h-full w-full flex-1 items-center justify-center">
				<div className="flex max-w-md flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Check your email :)</CardTitle>
							<CardDescription>Open the verification link that was sent to your email adress. You will be automatically redirected to the log in page once the verification is complete.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center gap-4"></CardContent>
						{/* <CardFooter className="flex flex-col gap-2 text-sm">
								<ResendCountdown />
							</CardFooter> */}
					</Card>
				</div>
			</div>
		);
	}
}
