"use client";

import { useContext } from "react";

import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import SubmitButton from "@/components/submitButton";

import FormSnapshot from "../../FormSnapshots";

import { TalentProfileContext } from "../context";
import { userStore } from "@/lib/store";

import { updateTalentProfile, submitFeedback } from "../../actions";

import { toast } from "sonner";

import type { ProfileCompletion } from "@/types";

export default function Page() {
	const user = userStore((state) => state.user);

	const context = useContext(TalentProfileContext);

	const profileCompletionStatus = context?.profileCompletionStatus as ProfileCompletion;

	console.log("profileCompletionStatus", profileCompletionStatus);

	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors, isDirty, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
	} = useForm({
		mode: "onBlur",
	});

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			let res;
			if (!profileCompletionStatus.overallComplete) {
				res = await updateTalentProfile(
					{
						profileCompletionStatus: {
							personalInfo: profileCompletionStatus.personalInfo,
							educationExperience: profileCompletionStatus.educationExperience,
							preferences: profileCompletionStatus.preferences,
							assessment: profileCompletionStatus.assessment,
							overallComplete: true,
						},
					},
					user.id,
				);
				if (res.status == 400) {
					throw new Error(res.message);
				}
			}

			if (data.feedback || data.hearAboutUs) {
				res = await submitFeedback({
					hearAboutUs: data.hearAboutUs || "Not provided",
					feedback: data.feedback || "No feedback provided",
					uid: user.id,
				});
				if (res.status === 500) {
					throw new Error("Failed to submit feedback");
				}
			}

			toast.success("Success");
		} catch (error: any) {
			toast.error("An error occured", {
				description: (error.message as string) + ". Please try again",
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-xl flex-1 flex-col gap-5">
			<h3 className="text-md font-semibold">Consent and Declaration</h3>
			{profileCompletionStatus.overallComplete ? (
				// If the profile is already complete, show disabled components
				<>
					<div className="flex items-center space-x-2">
						<Checkbox disabled checked={true} id="consentToShare" />
						<Label htmlFor="consentToShare">
							I consent to share information with partner companies <span className="text-red-500">*</span>
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox disabled checked={true} id="declarationOfAuthenticity" />
						<Label htmlFor="declarationOfAuthenticity">
							I declare that the information provided is true and accurate to the best of my knowledge <span className="text-red-500">*</span>
						</Label>
					</div>
				</>
			) : (
				<>
					<div className="flex items-center space-x-2">
						<Checkbox
							// checked={profileCompletionStatus.overallComplete}
							id="consentToShare"
							{...register("consentToShare", {
								validate: (value) => {
									if (value === false) {
										return "Consent is required";
									}
								},
							})}
						/>
						<Label htmlFor="consentToShare">
							I consent to share information with partner companies <span className="text-red-500">*</span>
						</Label>
					</div>
					{errors.consentToShare && <p className="text-red-500">{errors.consentToShare.message?.toString()}</p>}
					<div className="flex items-center space-x-2">
						<Checkbox
							id="declarationOfAuthenticity"
							{...register("declarationOfAuthenticity", {
								validate: (value) => {
									if (value === false) {
										return "Declaration of authenticity is required";
									}
								},
							})}
						/>
						<Label htmlFor="declarationOfAuthenticity">
							I declare that the information provided is true and accurate to the best of my knowledge <span className="text-red-500">*</span>
						</Label>
					</div>
					{errors.declarationOfAuthenticity && <p className="text-red-500">{errors.declarationOfAuthenticity.message?.toString()}</p>}
				</>
			)}

			<h3 className="text-md font-semibold">Feedback</h3>
			<div>
				<Label>How did you hear about this platform?</Label>
				<Controller
					name="hearAboutUs"
					control={control}
					rules={{
						validate: (value) => {
							if (profileCompletionStatus.overallComplete && !value) {
								return "Please select an option";
							}
						},
					}}
					render={({ field, fieldState }) => (
						<>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue placeholder="Select an option" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="socialMedia">Social Media</SelectItem>
									<SelectItem value="universityReferral">University Referral</SelectItem>
									<SelectItem value="friends">Friends</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
							{fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
						</>
					)}
				/>
				{errors.hearAboutUs && <p className="text-xs text-destructive">{errors.hearAboutUs.message?.toString()}</p>}
			</div>
			<div>
				<Label htmlFor="feedback">Do you have any feedback on this platform?</Label>
				<Textarea
					id="feedback"
					{...register("feedback", {
						minLength: {
							message: "Feedback must be at least 50 characters long",
							value: 50,
						},
					})}
				/>
				{errors.feedback && <p className="text-xs text-destructive">{errors.feedback.message?.toString()}</p>}
			</div>
			<div className="flex justify-end">
				{profileCompletionStatus.educationExperience && profileCompletionStatus.personalInfo && profileCompletionStatus.preferences ? (
					<SubmitButton
						buttonState={{
							isSubmitting,
							isSubmitted,
							isSubmitSuccessful,
							isValid,
							isDirty,
						}}
						loadingText="Submiting"
						children="Submit"
						className="w-fit"
					/>
				) : (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button disabled size={"lg"} className="!pointer-events-auto">
									Submit
								</Button>
							</TooltipTrigger>
							<TooltipContent>You must complete all sections of your profile before submitting.</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</form>
	);
}
