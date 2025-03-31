"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";

import { PricingCard } from "@/components/PricingCard";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import DatePickerInput from "@/components/DatePicker";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";
import SubmitButton from "@/components/submitButton";

import { CircleCheck, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { industries } from "@/lib/shared";
import { onBoardCompany, onBoardTalent } from "./actions";
import { userStore } from "@/lib/store";
import { plans } from "@/lib/shared";

import type { Plan } from "@/types/stripe";

const accountTypes = [
	{
		label: "Employer account",
		description: "For bussinesses/companies looking to hire",
		value: "employer",
	},
	{
		label: "Talent account",
		description: "For aspiring talents looking for a job",
		value: "talent",
	},
];

function formatDate(date: Date, locale: string = "en-US"): string {
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function Stepper({ steps, currentStep, setCurrentStep, className }: { steps: string[]; currentStep: number; setCurrentStep?: (step: number) => void; className?: string }) {
	return (
		<div className={cn("flex gap-2", className)}>
			{steps.map((step, index) => {
				if (index + 1 < steps.length) {
					return (
						<span
							onClick={() => {
								if (setCurrentStep) {
									setCurrentStep(index);
								}
							}}
							key={index}
							className={cn("flex cursor-pointer items-center md:w-full", index == currentStep ? "text-foreground" : "text-muted-foreground")}
						>
							{index == currentStep ? <CircleCheck size={20} className="me-2 fill-muted-foreground stroke-background" /> : <span className="me-1">{index + 1}.</span>}
							{steps[index]}
							<div className="flex-2 ml-1 hidden h-[1px] flex-1 bg-muted-foreground md:block"></div>
							<div className="ml-2 text-xl md:hidden">/</div>
						</span>
					);
				} else {
					return (
						<span
							onClick={() => {
								if (setCurrentStep) {
									setCurrentStep(index);
								}
							}}
							key={index}
							className={cn("flex cursor-pointer items-center", index == currentStep ? "text-foreground" : "text-muted-foreground")}
						>
							{index == currentStep ? <CircleCheck size={20} className="me-2 fill-muted-foreground stroke-background" /> : <span className="me-1">{index + 1}.</span>}
							{steps[index]}
						</span>
					);
				}
			})}
		</div>
	);
}

export default function page() {
	const user = userStore((state) => state.user);
	// console.log(user);
	const router = useRouter();

	const [error, setError] = useState({
		status: false,
		message: "",
	});

	// turn back
	const [currentStep, setCurrentStep] = useState(2);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
		watch,
		control,
		setValue,
	} = useForm();

	const selectedAccountType = watch("accountType");

	const onTalentSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			let res = await onBoardTalent(user.id, {
				fullName: data.fullName,
				dateOfBirth: data.dateOfBirth.toISOString(),
				email: user.email,
				phoneNumber: data.phoneNumber,
			});
			if (res.status == 200) {
				setCurrentStep(2);
				setTimeout(() => {
					router.push("/dashboard");
				}, 5000);
			}
		} catch (error: any) {
			console.log(error);
			setError({ status: true, message: error.message });
			setTimeout(() => {
				setError({ status: false, message: "" });
			}, 10000);
		}
	};

	const onCompanySubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			let res = await onBoardCompany(user.id, {
				companyName: data.companyName,
				contactPersonName: data.contactPersonName,
				contactPersonPosition: data.contactPersonPosition,
				companyWebsite: data.companyWebsite,
				industry: data.industry,
				email: user.email,
			});
			setCurrentStep(2);
			if (res.status == 200) {
				router.push("/dashboard");
			}
		} catch (error: any) {
			console.error(error);
			setError({ status: true, message: error.message });
			setTimeout(() => {
				setError({ status: false, message: "" });
			}, 10000);
		}
	};

	if (currentStep == 0) {
		return (
			<div className="flex h-full w-full flex-1 items-center justify-center">
				<div className="flex w-full max-w-lg flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<Stepper className="mb-5" steps={["Account Type", "Personal Info", "Done"]} currentStep={currentStep} setCurrentStep={setCurrentStep} />
							<CardTitle className="text-xl">What kind of account would you like to open?</CardTitle>
						</CardHeader>
						<CardContent className="flex">
							<div className="flex w-full justify-center gap-5 px-5 text-muted-foreground">
								{accountTypes.map((accountType, index) => {
									if (selectedAccountType == accountType.value) {
										return (
											<button
												key={index}
												onClick={() => {
													setCurrentStep(1);
													setValue("accountType", accountType.value);
												}}
												className="items-center. flex flex-col justify-between gap-2 rounded-lg border border-primary p-4 shadow-sm"
											>
												{/* <BriefcaseBusiness size={48} className="ring-foreground" /> */}
												<span className="font-medium">{accountType.label}</span>
												<p className="text-xs">{accountType.description}</p>
											</button>
										);
									} else {
										return (
											<button
												key={index}
												onClick={() => {
													setCurrentStep(1);
													setValue("accountType", accountType.value);
												}}
												className="items-center. flex flex-col justify-between gap-2 rounded-lg border p-4 shadow-sm hover:border-primary-300"
											>
												{/* <BriefcaseBusiness size={48} className="ring-foreground" /> */}
												<span className="font-medium">{accountType.label}</span>
												<p className="text-xs">{accountType.description}</p>
											</button>
										);
									}
								})}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	} else if (currentStep == 1) {
		if (selectedAccountType == "talent") {
			return (
				<div className="flex h-full w-full flex-1 items-center justify-center">
					<div className="flex w-full max-w-md flex-col gap-6">
						<Card>
							<CardHeader className="text-center">
								<Stepper className="mb-2" steps={["Account Type", "Personal Info", "Done"]} currentStep={currentStep} setCurrentStep={setCurrentStep} />
								<CardTitle className="text-xl">Personal information</CardTitle>
								<CardDescription>Lets get to know you</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit(onTalentSubmit)} className="mx-auto grid w-full max-w-sm gap-5">
									<div className="grid gap-5">
										<div className="grid gap-2">
											<Label htmlFor="email">Full name</Label>
											<Input {...register("fullName", { required: true })} id="fullName" type="text" autoComplete="name" />
											{errors.fullName && (
												<span role="alert" className="text-xs text-muted-foreground">
													{errors.fullName.message as string}
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
															defaultCountry="US"
															// {...register("phoneNumber", { required: true, maxLength: 15 })}
														/>
														{errors.phoneNumber && (
															<span role="alert" className="text-xs text-muted-foreground">
																{errors.phoneNumber.message as string}
															</span>
														)}
													</>
												)}
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="date">Date of Birth</Label>
											<Controller control={control} name="dateOfBirth" render={({ field }) => <DatePickerInput date={field.value} setDate={field.onChange} />}></Controller>
										</div>
									</div>
									<SubmitButton
										buttonState={{
											isSubmitted,
											isSubmitting,
											isSubmitSuccessful,
											isValid,
										}}
										loadingText="Setting you up"
									>
										Finish
									</SubmitButton>
									{error.status && <p className="w-full text-center text-xs text-destructive">{error.message}</p>}
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			);
		} else {
			return (
				<div className="flex h-full w-full flex-1 items-center justify-center">
					<div className="flex w-full max-w-md flex-col gap-6">
						<Card>
							<CardHeader className="text-center">
								<Stepper className="mb-2" steps={["Account Type", "Company Info", "Billing"]} currentStep={currentStep} setCurrentStep={setCurrentStep} />
								<CardTitle className="text-xl">Company information</CardTitle>
								<CardDescription>Lets get to your company</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit(onCompanySubmit)} className="mx-auto grid w-full max-w-sm gap-5">
									<div className="grid gap-5">
										<div className="grid gap-2">
											<Label htmlFor="companyName">
												Company Name <span className="text-xs text-destructive">*</span>
											</Label>
											<Input
												id="companyName"
												{...register("companyName", {
													required: "Company name is required",
													maxLength: { value: 255, message: "Company name cannot exceed 255 characters" },
												})}
											/>
											{errors.companyName && (
												<p role="alert" className="mt-1 text-xs text-destructive">
													{errors.companyName.message as string}
												</p>
											)}
										</div>
										<div className="grid gap-2">
											<Label htmlFor="contactPersonName">
												Contact Person Name <span className="text-xs text-destructive">*</span>
											</Label>
											<Input
												id="contactPersonName"
												{...register("contactPersonName", {
													required: "Contact person name is required",
													maxLength: { value: 255, message: "Contact person name cannot exceed 255 characters" },
												})}
											/>
											{errors.contactPersonName && (
												<p role="alert" className="mt-1 text-xs text-destructive">
													{errors.contactPersonName.message as string}
												</p>
											)}
										</div>
										<div className="grid gap-2">
											<Label htmlFor="contactPersonPosition">
												Contact Person Position <span className="text-xs text-destructive">*</span>
											</Label>
											<Input
												id="contactPersonPosition"
												{...register("contactPersonPosition", {
													required: "Contact person position is required",
													maxLength: { value: 255, message: "Contact person position cannot exceed 255 characters" },
												})}
											/>
											{errors.contactPersonPosition && (
												<p role="alert" className="mt-1 text-xs text-destructive">
													{errors.contactPersonPosition.message as string}
												</p>
											)}
										</div>
										<div className="grid gap-2">
											<Label htmlFor="companyWebsite">Company Website</Label>
											<Input
												id="companyWebsite"
												{...register("companyWebsite", {
													maxLength: { value: 255, message: "Company website cannot exceed 255 characters" },
												})}
											/>
											{errors.companyWebsite && (
												<p role="alert" className="mt-1 text-xs text-destructive">
													{errors.companyWebsite.message as string}
												</p>
											)}
										</div>
										<div className="grid gap-2">
											<Label htmlFor="industry">
												Industry <span className="text-xs text-destructive">*</span>
											</Label>
											<Controller
												name="industry"
												control={control}
												defaultValue="Select an Industry"
												rules={{ required: "An Industry is required" }}
												render={({ field, fieldState }) => (
													<Popover>
														<PopoverTrigger asChild>
															<Button variant="outline" className="flex justify-between font-normal">
																{field.value}
																<ChevronsUpDown size={20} />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-[250px] p-0">
															<Command>
																<CommandInput placeholder="Search Industry..." className="h-9" />
																<CommandList>
																	<CommandEmpty>No Industry found</CommandEmpty>
																	<CommandGroup>
																		{industries.map((industry, index) => (
																			<CommandItem key={index} onSelect={() => field.onChange(industry.value)}>
																				{industry.label}
																			</CommandItem>
																		))}
																	</CommandGroup>
																</CommandList>
															</Command>
														</PopoverContent>
														{fieldState.error && (
															<span role="alert" className="text-xs text-destructive">
																{fieldState.error.message}
															</span>
														)}
													</Popover>
												)}
											/>
										</div>

										{/* TODO: move phone number to profile */}
										{/* <div className="grid gap-2">
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
															defaultCountry="US"
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
										</div> */}
									</div>
									<SubmitButton
										buttonState={{
											isSubmitted,
											isSubmitting,
											isSubmitSuccessful,
											isValid,
										}}
										loadingText="Setting you up"
									>
										Finish
									</SubmitButton>
									{error.status && <p className="w-full text-center text-xs text-destructive">{error.message}</p>}
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			);
		}
	} else if (currentStep == 2) {
		return (
			<div className="h-full. flex w-full flex-1 items-center justify-center">
				<div className="flex w-full flex-col items-center gap-4">
					<h2 className="text-3xl">Choose your plan</h2>
					<div className="grid w-full max-w-2xl grid-cols-1 place-items-center gap-2 sm:grid-cols-2">
						{plans.slice(0, 2).map((plan, index) => (
							<PricingCard
								key={index}
								plan={plan as Plan}
								user={user}
								action={(planName, userType) => {
									if (planName != "Enteprise") {
										router.push(`/subscription?plan=${planName}`);
									} else {
										window.open("mailto:admin@tu-fund.com", "_blank");
									}
								}}
							/>
						))}
					</div>
				</div>
				{/* <Dialog>
							<DialogTrigger asChild>
								<Button className="w-full">Start free trial</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog> */}
			</div>
		);
	}
}
