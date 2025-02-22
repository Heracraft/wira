"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEventHandler, useEffect } from "react";

import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { CircleUserRound, BriefcaseBusiness, Loader2, CalendarIcon } from "lucide-react";

import Stepper from "@/components/Stepper";

import { format, isValid, parse } from "date-fns";

import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

import { updateUserProfile, verifyIdentity } from "@/lib/actions/auth";
import { userStore } from "@/lib/store";

function formatDate(date: Date, locale: string = "en-US"): string {
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function DatePickerInput({ date, setDate }: { date: Date; setDate: React.Dispatch<React.SetStateAction<Date | undefined>> }) {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	// const [date, setDate] = useState<Date>();

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setInputValue(e.currentTarget.value);
		const date = parse(e.currentTarget.value, "dd-MM-y", new Date());
		if (isValid(date)) {
			setDate(date);
		} else {
			setDate(undefined);
		}
	};

	const handleSelectDate = React.useCallback((selected: any) => {
		setDate(selected);
		if (selected) {
			setOpen(false);
			setInputValue(format(selected, "dd-MM-y"));
		} else {
			setInputValue("");
		}
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<fieldset className="relative">
				<Input placeholder="DD-MM-YYYY" value={inputValue} onChange={handleInputChange} />
				<PopoverTrigger asChild>
					<Button aria-label="Pick a date" variant={"secondary"} className={cn("absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-1.5 font-normal", !date && "text-muted-foreground")}>
						<CalendarIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
			</fieldset>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" defaultMonth={date} selected={date} onSelect={handleSelectDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
}

function SubmitButton({ isIdentityVerified, isSubmitting, isSubmitSuccessful, isValid, children }: { isIdentityVerified: boolean; isSubmitting: boolean; isSubmitSuccessful: boolean; isValid: boolean; children: React.ReactNode }) {
	if (isSubmitting) {
		return (
			<Button className="w-full flex items-center gap-2">
				<Loader2 className="animate-spin" size={20} />
				{children}ing
			</Button>
		);
	}
	if (!isValid || !isIdentityVerified) {
		return (
			<Button disabled type="submit" className="w-full">
				{children}
			</Button>
		);
	}
	return (
		<Button type="submit" className="w-full">
			{children}
		</Button>
	);
}

export default function page() {
	const user = userStore((state) => state.user);

	const router = useRouter();
	const { toast } = useToast();

	const [currentStep, setCurrentStep] = useState(0);

	const [isIdentityVerified, setIsIdentityVerified] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
		watch,
		control,
		setValue,
	} = useForm();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user?.username) {
				throw new Error("User not found");
			}
			let res = await updateUserProfile(user?.username, { firstName: data.firstName, lastName: data.lastName, NIDA: data.NIDA.replaceAll("-", "").replaceAll(" ", ""), dateOfBirth: data.dateOfBirth });
			console.log(res);
			setCurrentStep(2);
		} catch (error) {
			console.error(error);
		}
	};

	const dateOfBirth = useWatch({ control, name: "dateOfBirth" });
	const NIDA = useWatch({ control, name: "NIDA" });
	const lastName = useWatch({ control, name: "lastName" });

	useEffect(() => {
		console.log({ dateOfBirth, NIDA, lastName });

		if (dateOfBirth && NIDA && lastName) {
			toast({
				title: "Verifying Identity",
				description: "Please wait while we verify your identity",
			});
			verifyIdentity({ dateOfBirth: format(dateOfBirth, "y-MM-dd"), NIN: NIDA.replaceAll("-", "").replaceAll(" ", ""), lastName })
				.then((res) => {
					console.log(res);
					if (res.status === 200) {
						toast({
							title: "Identity verified",
							description: "Your identity has been verified successfully",
						});
						setIsIdentityVerified(true);
					}
				})
				.catch(() => {
					toast({
						title: "Identity verification failed",
						description: "Your identity could not be verified. Please try again",
						variant: "destructive",
					});
				});
		}
	}, [dateOfBirth, NIDA, lastName]);

	if (currentStep == 0) {
		return (
			<div className="flex flex-1 w-full h-full justify-center items-center">
				<div className="flex flex-col gap-6 max-w-md w-full">
					<Card>
						<CardHeader className="text-center">
							<Stepper className="mb-2" steps={["Account Type", "Personal Info", "Done"]} currentStep={currentStep} setCurrentStep={setCurrentStep} />
							<CardTitle className="text-xl">What kind of Flora account would you like to open?</CardTitle>
							<CardDescription>You can always change this later</CardDescription>
						</CardHeader>
						<CardContent className="flex">
							<div className="flex justify-center w-full gap-5 text-muted-foreground	">
								<button
									onClick={() => {
										setCurrentStep(1);
										setValue("accountType", "bussiness");
									}}
									className="flex flex-col w-[180px] shadow items-center gap-2 p-4 border border-border rounded-lg bg-slate-100"
								>
									<BriefcaseBusiness size={48} className="ring-foreground" />
									<span className="font-semibold">Personal account</span>
									<p className=" text-xs">For individuals or families. for Personal investments</p>
								</button>
								<button
									onClick={() => {
										router.push("/coming-soon");
									}}
									className="flex flex-col w-[180px] shadow items-center gap-2 p-4 border border-border rounded-lg bg-slate-100"
								>
									<CircleUserRound size={48} className="" />
									<span className="font-semibold">Bussiness account</span>
									<p className="text-muted-foreground text-xs">For companies and institutional investors</p>
								</button>
							</div>
						</CardContent>
					</Card>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
						Adhere to our <Link href="#">Acceptable use Policy</Link> . You cannot use a personal account for business purposes.
					</div>
				</div>
			</div>
		);
	} else if (currentStep == 1) {
		return (
			<div className="flex flex-1 w-full h-full justify-center items-center">
				<div className="flex flex-col gap-6 max-w-md w-full">
					<Card>
						<CardHeader className="text-center">
							<Stepper className="mb-2" steps={["Account Type", "Personal Info", "Done"]} currentStep={currentStep} setCurrentStep={setCurrentStep} />
							<CardTitle className="text-xl">Personal information</CardTitle>
							<CardDescription>Lets get to know you</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full max-w-sm mx-auto">
								<div className="grid gap-5 ">
									<div className="grid gap-2">
										<Label htmlFor="email">First name</Label>
										<Input {...register("firstName", { required: true })} id="firstName" type="text" autoComplete="given-name" />
										{errors.firstName && (
											<span role="alert" className="text-muted-foreground text-xs">
												{errors.firstName.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Last name</Label>
										<Input {...register("lastName", { required: true })} id="lastName" type="text" autoComplete="family-name" />
										{errors.lastName && (
											<span role="alert" className="text-muted-foreground text-xs">
												{errors.lastName.message as string}
											</span>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="date">Date of Birth</Label>
										<Controller
											control={control}
											name="dateOfBirth"
											render={({ field }) => (
												<DatePickerInput date={field.value} setDate={field.onChange} />

												// <Popover>
												// 	<PopoverTrigger asChild>
												// 		<Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
												// 			{field.value ? formatDate(field.value, "PPP") : <span>Pick a date</span>}
												// 			<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												// 		</Button>
												// 	</PopoverTrigger>
												// 	<PopoverContent className="w-auto p-0" align="start">
												// 		<Calendar captionLayout="dropdown" mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
												// 	</PopoverContent>
												// </Popover>
											)}
										></Controller>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="NIDA">National ID Number</Label>
										<Input {...register("NIDA", { required: true, minLength: 20, maxLength: 23 })} id="NIDA" type="text" maxLength={23} placeholder="Your NIDA number" />
										{errors.NIDA && (
											<span role="alert" className="text-muted-foreground text-xs">
												{errors.NIDA.message as string}
											</span>
										)}
									</div>
								</div>
								<SubmitButton isIdentityVerified={isIdentityVerified} isSubmitting={isSubmitting} isSubmitSuccessful={isSubmitSuccessful} isValid={isValid}>
									Finish
								</SubmitButton>
							</form>
						</CardContent>
					</Card>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
						Adhere to our <Link href="#">Acceptable use Policy</Link> . You cannot use a personal account for business purposes.
					</div>
				</div>
			</div>
		);
	} else if (currentStep == 2) {
		return (
			<div className="flex flex-1 w-full h-full justify-center items-center">
				<div className="flex flex-col gap-6 max-w-md w-full">
					<Card>
						<CardHeader className="text-center items-center">
							<CardTitle className="text-3xl">Congratulations. Your account is ready</CardTitle>
							{/* <CardDescription> </CardDescription> */}
						</CardHeader>
						<CardContent>
							<div className="flex gap-2">
								<Button asChild className="w-full">
									<Link href="/dashboard">Start Investing</Link>
								</Button>
								<Button variant={"secondary"} asChild className="w-full">
									<Link href="/">Learnmore</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}
}
