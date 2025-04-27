"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { useForm, SubmitHandler, Controller, set } from "react-hook-form";

import SubmitButton from "@/components/submitButton";
import PasswordInput from "@/components/auth/PasswordInput";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Info } from "lucide-react";

import { resetPassword } from "./actions";

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
		control,
		reset,
	} = useForm();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
        const password = data.password;
        const { status, message } = await resetPassword({ password });
        if (status === 400) {
            setError({ status: true, message });
        }
	};

	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Reset your password</CardTitle>
						<CardDescription>Enter your new password.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
							<div className="flex w-full flex-col gap-2">
								<Label htmlFor="password">New Password</Label>
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
							</div>
						<SubmitButton
							buttonState={{
								isSubmitted,
								isSubmitting,
								isSubmitSuccessful,
								isValid,
							}}
							loadingText="Resetting..."
						>
							Reset Password
						</SubmitButton>
						</form>
					</CardContent>
					<CardFooter>
						{error.status && <p className="w-full text-center text-xs text-destructive">{error.message}</p>}
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
