"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

import { useForm, SubmitHandler, Controller, set } from "react-hook-form";

import { formatSecondsToMinSec, maskEmail } from "@/lib/utils";

import { signup, verifyEmail } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

import { Loader2, Info } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";

function SubmitButton({ errorOccured, isSubmitting, isSubmitted, isSubmitSuccessful, isValid }: { errorOccured?: boolean; isSubmitting: boolean; isSubmitted: boolean; isSubmitSuccessful: boolean; isValid: boolean }) {
	if (isSubmitting) {
		return (
			<Button type="submit" className="w-full flex items-center gap-2">
				<Loader2 className="animate-spin" size={20} />
				Registering
			</Button>
		);
	}
	if (errorOccured) {
		return (
			<Button variant={"destructive"} className="w-full">
				An error occurred. Please try again
			</Button>
		);
	}

	// Remove this so users can try to submit the form even if it's invalid then show the error messages
	if (!isValid && isSubmitted) {
		return (
			<Button disabled type="submit" className="w-full">
				Register
			</Button>
		);
	}
	return (
		<Button type="submit" className="w-full">
			Register
		</Button>
	);
}

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
	if (countDown == 0)
		return (
			<p>
				Didn't receive the code?{" "}
				<button
					onClick={() => {
						// TODO: implement resend code
						console.log("Resend code");
					}}
					className="text-primary font-bold"
				>
					Resend
				</button>
			</p>
		);
}

export default function page() {
	const router = useRouter();

	const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
	const [errorOccured, setErrorOccured] = useState(false);

	const [otp, setOtp] = useState("");
	const [otpStatus, setOtpStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
		watch,
		control,
		reset,
	} = useForm();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			let res = await signup({
				username: data.username,
				email: data.email,
				phone: data.phoneNumber,
				password: data.password,
			});
			console.log(res);
			if (res.status == 200) {
				// let email = data.email;
				// await verifyEmail(email);
				setIsVerificationCodeSent(true);
			} else {
				setErrorOccured(true);
			}
		} catch (error) {
			console.error(error);
			setErrorOccured(true);
			setIsVerificationCodeSent(false);
			setTimeout(() => {
				reset();
				setErrorOccured(false);
			}, 2000);
		}
	};

	async function handleOtp() {
		try {
			// verify email
			setOtpStatus("loading");
			let res = await verifyEmail(watch("email"), otp, watch("username"));
			if (res.status == 200) {
				setOtpStatus("success");
				router.push("/auth/");
			}
		} catch (error) {
			setOtpStatus("error");
			setTimeout(() => {
				setOtpStatus("idle");
			}, 2000);
		}
	}

	useEffect(() => {
		if (otp.length == 6) {
			handleOtp();
		}
	}, [otp]);

	if (!isVerificationCodeSent) {
		return (
			<div className="flex w-full h-full justify-center items-center">
				<div className="flex flex-col gap-6 max-w-md">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Create your Flora account</CardTitle>
							<CardDescription>
								Already have an account?{" "}
								<Link href="/auth" className="underline underline-offset-4">
									Login
								</Link>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
								<div className="grid gap-5">
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input {...register("username", { required: true })} id="username" type="text" placeholder="John" />
										{errors.username && (
											<span role="alert" className="text-muted-foreground text-xs">
												A username is required
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email address</Label>
										<Input {...register("email", { required: "An email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" } })} id="email" type="email" placeholder="m@example.com" />
										{/* {errors.email && <span role="alert">{errors.email.message}</span>} */}
										{errors.email && (
											<span role="alert" className="text-muted-foreground text-xs">
												{errors.email.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="confirmPassword">Phone Number</Label>
										<Controller
											name="phoneNumber"
											control={control}
											defaultValue=""
											rules={{ required: "A Phone number is required" }}
											render={({ field }) => (
												<>
													<PhoneInput
														value={field.value}
														onChange={field.onChange}
														defaultCountry="TZ"
														// {...register("phoneNumber", { required: true, maxLength: 15 })}
													/>
													{errors.phoneNumber && (
														<span role="alert" className="text-muted-foreground text-xs">
															{errors.phoneNumber.message as string}
														</span>
													)}
												</>
											)}
										/>
										{/* <PhoneInput defaultCountry="TZ" {...register("phoneNumber", { required: true, maxLength: 15 })} /> */}
									</div>
									<div className="w-full flex flex-col gap-2">
										<Label htmlFor="password">Password</Label>
										<PasswordInput id="password" hideRequirements hideStrength value={watch("password") || ""} {...register("password", { required: "A password is required", pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, message: "Password must have 8+ characters, including a number, an uppercase letter, a lowercase letter, and a special character (!@#$)." } })} />
										{errors.password && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.password.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="confirmPassword">Confirm password</Label>
										<PasswordInput
											{...register("confirmPassword", {
												required: "Confirm Password is required",
												validate: (value) => value === watch("password") || "Passwords do not match",
											})}
											hideRequirements
											hideStrength
										/>
										{errors.confirmPassword && (
											<span role="alert" className="text-xs text-muted-foreground">
												{errors.confirmPassword.message as string}
											</span>
										)}
										{/* <p className="text-xs text-muted-foreground">Passwords do not match</p> */}
									</div>
									<SubmitButton errorOccured={errorOccured} isSubmitting={isSubmitting} isSubmitted={isSubmitted} isSubmitSuccessful={isSubmitSuccessful} isValid={isValid} />
								</div>
								{/* <div className="text-center text-sm">
									Already have an account?{" "}
									<a href="/auth" className="underline underline-offset-4">
										Login
									</a>
								</div> */}
							</form>
						</CardContent>
					</Card>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
						By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex flex-1 w-full h-full justify-center items-center">
				<div className="flex flex-col gap-6 max-w-md">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Check your email :)</CardTitle>
							<CardDescription className="flex items-center max-w-sm bg-accent p-2 rounded-md">
								<Info size={32} className="mr-2 flex-shrink-0 stroke-accent fill-muted-foreground" />
								<p className="text-start">Enter the 5-digit verification code that was sent to {maskEmail(watch("email"))}. This email can take up to a minute to arrive</p>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardContent className="flex flex-col gap-4 items-center">
								<InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
									</InputOTPGroup>
									<InputOTPSeparator/>
									<InputOTPGroup>
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</CardContent>
						</CardContent>
						<CardFooter className="flex flex-col gap-2 text-sm">
							<Button
								className="w-full"
								onClick={async () => {
									if (otp.length == 6) {
										await handleOtp();
									}
								}}
							>
								{otpStatus == "loading" ? (
									<>
										<Loader2 className="animate-spin mr-2" size={20} />
										verifying
									</>
								) : (
									<>Verify</>
								)}
							</Button>
							{otpStatus == "error" && <p className="text-xs text-destructive">An error occurred. Please try again</p>}
							<ResendCountdown />
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}
}
