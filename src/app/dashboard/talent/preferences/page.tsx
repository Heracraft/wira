"use client";

import { useContext, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import SubmitButton from "@/components/submitButton";

import { toast } from "sonner";

import FormSnapshot from "../../FormSnapshots";
import { TalentProfileContext } from "../context";

import { userStore } from "@/lib/store";
import { industries, workEnvironments, teamDynamics } from "@/lib/shared";

import { updateTalentProfile } from "../../actions";

import type { ProfileCompletion } from "@/types/dashboard";

const SNAPSHOT_NAME = "form-snapshot-prefernces";

export default function Page() {
	const context = useContext(TalentProfileContext);
	const user = userStore((state) => state.user);

	const profileCompletionStatus = context?.profileCompletionStatus as ProfileCompletion; 

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
			const res = await updateTalentProfile({
				...data,
				profileCompletionStatus: {
					personalInfo: profileCompletionStatus.personalInfo,
					educationExperience: profileCompletionStatus.educationExperience,
					preferences: true,
					overallComplete:profileCompletionStatus.overallComplete
				},
			}, user.id);
			if (res.status == 400) {
				throw new Error(res.message);
			}
			toast.success(res.message);
			setTimeout(() => {
				// just in case some snapshot has already been debounced to be saved (5 secs)
				localStorage.removeItem(SNAPSHOT_NAME);
			}, 6000);
		} catch (error: any) {
			toast.error("An error occured", {
				description: (error.message as string) + ". Please try again",
			});
		}
	};
	const formValues = watch();

	useEffect(() => {
		if (context) {
			setValue("preferredCompanies", context.preferredCompanyTypes);
		}
	}, [context]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-xl flex-1 flex-col gap-5">
			<FormSnapshot isDirty={isDirty} formValues={formValues} setValue={setValue} snapshotName={SNAPSHOT_NAME} />

			{/* Career Interests and Goals */}
			<h3 className="text-md font-medium">Career Interests and Goals</h3>
			<div>
				<Label>Preferred Industry/Area of Interest</Label>
				<div className="space-y-2">
					<Controller
						name="industryInterests"
						control={control}
						defaultValue={context?.industryInterests || []}
						rules={{
							required: "Please select at least one industry",
						}}
						render={({ field, fieldState }) => (
							<>
								{industries.map((industry) => (
									<div key={industry.value} className="flex items-center">
										<Checkbox
											id={industry.value}
											checked={field.value?.includes(industry.value) || false}
											onCheckedChange={(checked) => {
												const updatedValue = checked ? [...(field.value || []), industry.value] : (field.value || []).filter((item: string) => item !== industry.value);
												field.onChange(updatedValue);
											}}
										/>
										<Label htmlFor={industry.value} className="ml-2">
											{industry.label}
										</Label>
									</div>
								))}
								{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
							</>
						)}
					/>
				</div>
			</div>

			{/* Removed since these fields do not seem relevant to the new 'employer talent searching model' */}
			{/* Seems more relevant when you want to match talents to employers not when employers come looking */}
			{/* Plus they never show up on the designs for talent profiles */}

			{/* <div>
				<Label htmlFor="preferredRole">Preferred Type of Role/Position</Label>
				<Textarea id="preferredRole" {...register("preferredRole")} />
				{errors.preferredRole && <p className="text-red-500">{errors.preferredRole.message?.toString()}</p>}
			</div>

			<div>
				<Label htmlFor="careerGoals">What are your long-term career goals?</Label>
				<Textarea id="careerGoals" {...register("careerGoals")} />
				{errors.careerGoals && <p className="text-red-500">{errors.careerGoals.message?.toString()}</p>}
			</div> */}

			{/* Position Preferences */}
			<h3 className="text-md font-medium">Position Preferences</h3>
			<div>
				<Label>Preferred Companies or Types of Companies</Label>
				<Controller
					control={control}
					name="preferredCompanyTypes"
					defaultValue={context?.preferredCompanyTypes || []}
					rules={{
						required: "Please select at least one company type",
					}}
					render={({ field, fieldState }) => (
						<>
							<div className="space-y-2">
								{["Start-ups", "Mid-sized Companies", "Large Enterprises"].map((companyType) => (
									<div key={companyType} className="flex items-center">
										<Checkbox
											checked={field.value?.includes(companyType)}
											onCheckedChange={(checked) => {
												const updatedValue = checked ? [...(field.value || []), companyType] : (field.value || []).filter((item: string) => item !== companyType);
												field.onChange(updatedValue);
											}}
											id={companyType}
											value={companyType}
										/>
										<Label htmlFor={companyType} className="ml-2">
											{companyType}
										</Label>
									</div>
								))}
							</div>
							{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
						</>
					)}
				/>
			</div>

			{/*  Again, the fields below are only really relevant to a matching style app, which the new Wira isn't*/}
			{/* Plus we don't use them anywhere */}

			{/* <div>
				<Label htmlFor="preferredCompanyCulture">Describe your preferred company culture</Label>
				<Textarea
					id="preferredCompanyCulture"
					{...register("preferredCompanyCulture", {
						required: "Preferred company culture description is required",
					})}
					placeholder="Please describe the type of company culture you're looking for..."
					className="h-32"
				/>
				{errors.preferredCompanyCulture && <p className="text-red-500">{errors.preferredCompanyCulture.message?.toString()}</p>}
			</div>

			<div>
				<Label>Preferred Work Environment</Label>
				<Controller
					name="preferredWorkEnvironment"
					control={control}
					rules={{ required: "Preferred work environment is required" }}
					render={({ field }) => (
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<SelectTrigger>
								<SelectValue placeholder="Select work environment" />
							</SelectTrigger>
							<SelectContent>
								{workEnvironments.map((env) => (
									<SelectItem key={env.value} value={env.value}>
										{env.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				{errors.preferredWorkEnvironment && <p className="text-red-500">{errors.preferredWorkEnvironment.message?.toString()}</p>}
			</div>

			<div>
				<Label>Preferred Team Dynamics</Label>
				<Controller
					name="preferredTeamDynamics"
					control={control}
					rules={{ required: "Preferred team dynamics is required" }}
					render={({ field }) => (
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<SelectTrigger>
								<SelectValue placeholder="Select team dynamics" />
							</SelectTrigger>
							<SelectContent>
								{teamDynamics.map((dynamic) => (
									<SelectItem key={dynamic.value} value={dynamic.value}>
										{dynamic.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				{errors.preferredTeamDynamics && <p className="text-red-500">{errors.preferredTeamDynamics.message?.toString()}</p>}
			</div>

			<div>
				<Label htmlFor="preferredLocations">Preferred Location(s)</Label>
				<Input id="preferredLocations" {...register("preferredLocations")} />
				{errors.preferredLocations && <p className="text-red-500">{errors.preferredLocations.message?.toString()}</p>}
			</div> */}

			{/* Work Type Preferences */}
			<h3 className="text-md font-medium">Work Type Preferences</h3>
			<div>
				<Label>Are you open to part-time, full-time, or both?</Label>
				<Controller
					name="workTypePreference"
					control={control}
					rules={{ required: "Please select the position type" }}
					defaultValue={context?.workTypePreference || ""}
					render={({ field, fieldState }) => (
						<>
							<RadioGroup value={field.value} onValueChange={field.onChange}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="part-time" id="part-time" />
									<Label htmlFor="part-time" className="peer">
										Part-time
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="full-time" id="full-time" />
									<Label htmlFor="full-time" className="peer">
										Full-time
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="both" id="both" />
									<Label htmlFor="both" className="peer">
										Both
									</Label>
								</div>
							</RadioGroup>
							{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
						</>
					)}
				/>
				{/* {errors.internshipType && <p className="text-red-500">{errors.internshipType.message}</p>} */}
			</div>
			<div className="mt-auto flex justify-end">
				<SubmitButton
					buttonState={{
						isSubmitting,
						isSubmitted,
						isSubmitSuccessful,
						isValid,
					}}
					loadingText="Saving"
					children="Save"
					className="w-fit"
					size="lg"
				/>
			</div>
		</form>
	);
}
