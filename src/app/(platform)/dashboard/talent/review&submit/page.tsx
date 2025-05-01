"use client";

import { useContext, useState } from "react";

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

	const [isProfileCompletedModalOpen, setIsProfileCompleteModalOpen] = useState(false);

	// console.log("profileCompletionStatus", profileCompletionStatus);

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
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
			const newProfileCompletionStatus = {
				personalInfo: profileCompletionStatus.personalInfo,
				educationExperience: profileCompletionStatus.educationExperience,
				preferences: profileCompletionStatus.preferences,
				assessment: profileCompletionStatus.assessment,
				spotlight: profileCompletionStatus.spotlight,
				overallComplete: true,
			} as ProfileCompletion;

			const allSectionsOfProfileComplete = Object.values(newProfileCompletionStatus).every((value) => value === true);

			if (allSectionsOfProfileComplete) {
				// They have completed all sections of the profile

				if (!profileCompletionStatus.overallComplete) {
					// Update the profile completion status in the database
					// Only if it was not already complete

					res = await updateTalentProfile(
						{
							profileCompletionStatus: newProfileCompletionStatus,
						},
						user.id,
					);
					if (res.status == 400) {
						throw new Error(res.message);
					}
					toast.success("Thank you for completing your profile!");
					setIsProfileCompleteModalOpen(true);
				}
			} else {
				// They have not completed all sections of the profile
				toast.error("Please complete all sections of your profile before submitting.");
				return;
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
				if (profileCompletionStatus.overallComplete) {
					// If they had already completed all sections of the profile, but have submitted feedback,
					// show a success message on successful feedback submission
					// This is to avoid showing 2 success messages in a row.
					// since the profile completion status is already complete therefore the other success message will not be shown (no update)
					// remove the condition above if you dont mind showing 2 success messages in a row.
					toast.success("Feedback submitted successfully");
					setValue("feedback", "");
					setValue("hearAboutUs", "");
				}
			}
		} catch (error: any) {
			toast.error("An error occured", {
				description: (error.message as string) + ". Please try again",
			});
		}
	};

	console.log("consent", watch("consentToShare"));

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
						<Controller
							name="consentToShare"
							control={control}
							defaultValue={false}
							rules={{
								required: "You must consent to share information with partner companies",
							}}
							render={({ field }) => (
								<Checkbox
									checked={field.value}
									onCheckedChange={(value) => {
										field.onChange(value);
									}}
									id="consentToShare"
								/>
							)}
						/>
						<Label htmlFor="consentToShare">
							I consent to share information with partner companies <span className="text-destructive">*</span>
						</Label>
					</div>
					{errors.consentToShare && <p className="text-xs text-destructive">{errors.consentToShare.message?.toString()}</p>}
					<div className="flex items-center space-x-2">
						<Controller
							name="declarationOfAuthenticity"
							control={control}
							defaultValue={false}
							rules={{
								required: "You must declare the authenticity of the information provided",
							}}
							render={({ field }) => (
								<Checkbox
									checked={field.value}
									onCheckedChange={(value) => {
										field.onChange(value);
									}}
									id="declarationOfAuthenticity"
								/>
							)}
						/>
						<Label htmlFor="declarationOfAuthenticity">
							I declare that the information provided is true and accurate to the best of my knowledge <span className="text-red-500">*</span>
						</Label>
					</div>
					{errors.declarationOfAuthenticity && <p className="text-xs text-destructive">{errors.declarationOfAuthenticity.message?.toString()}</p>}
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
							if (!profileCompletionStatus.overallComplete) {
								return true;
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
			<Dialog open={isProfileCompletedModalOpen} onOpenChange={setIsProfileCompleteModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Profile Completed</DialogTitle>
						<DialogDescription>
							Thank you for successfully completing your profile! You are now visible to employers. We wish you the best in your job search!
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end">
						<Button size={"lg"} onClick={() => setIsProfileCompleteModalOpen(false)}>Close</Button>
					</div>
				</DialogContent>
			</Dialog>
		</form>
	);
}
