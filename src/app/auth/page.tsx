"use client";
// import { useRouter } from "next/navigation";
// import { revalidatePath } from "next/cache";

import Link from "next/link";

import { useState } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";

import SubmitButton from "@/components/submitButton";
import PasswordInput from "@/components/auth/PasswordInput";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { login, revalidatePathFromClient } from "./actions";

export default function page() {
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
		watch,
		// control,
		reset,
	} = useForm();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		const email = data.email;
		const password = data.password;
		let res = await login({ email, password });
		// TODO: fix: user state does not update after login
		if (res.status == 400) {
			setError({ status: true, message: error.message });
			setTimeout(() => {
				// reset();
				setError({ status: false, message: "" });
			}, 10000);
		}
	};

	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Welcome back</CardTitle>
						<CardDescription>Login with your email and password</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-6">
								<div className="grid gap-6">
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Invalid email address",
												},
											})}
											id="email"
											type=" email"
											placeholder="m@example.com"
											required
										/>
										{errors.email && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.email.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label htmlFor="password">Password</Label>
											<a href="#" className="ml-auto text-xs underline-offset-4 hover:underline">
												Forgot your password?
											</a>
										</div>
										{/* TODO: make sure both /auth & /auth/register require an 8+ password */}
										<PasswordInput id="password" hideRequirements hideStrength value={watch("password") || ""} {...register("password", { required: "A password is required", pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, message: "Password must have 8+ characters, including a number, an uppercase letter, a lowercase letter, and a special character (!@#$)." } })} autoComplete="current-password" />
										{errors.password && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.password.message as string}
											</span>
										)}
									</div>
									{/* <PasswordInput/> */}
									<SubmitButton
										buttonState={{
											isSubmitted,
											isSubmitting,
											isSubmitSuccessful,
											isValid,
										}}
										loadingText="Logging in"
									>
										Login
									</SubmitButton>
									{error.status && <p className="w-full text-center text-xs text-destructive">{error.message}</p>}
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link href="/auth/sign-up" className="underline underline-offset-4">
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
				<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
					By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
				</div>
			</div>
		</div>
	);
}
