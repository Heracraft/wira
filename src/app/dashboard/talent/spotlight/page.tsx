"use client";

import dynamic from "next/dynamic";

import { useEffect, useContext, useState } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton";


// import LocationInputs from "./LocationInputs";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";
import DatePickerInput from "@/components/DatePicker";
import SubmitButton from "@/components/submitButton";

import FormSnapshot from "../../FormSnapshots";

import { TalentProfileContext } from "../context";
import { userStore, createClient } from "@/lib/store";

import { updateTalentProfile } from "../../actions";

import { toast } from "sonner";

import type { ProfileCompletion } from "@/types";

const SNAPSHOT_NAME = "form-snapshot-spotlight";

export default function Page() {
	const user = userStore((state) => state.user);

	const context = useContext(TalentProfileContext);

	const profileCompletionStatus = context?.profileCompletionStatus as ProfileCompletion;

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors, isDirty, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
	} = useForm({
		mode: "onBlur",
	});

	useEffect(() => {
		if (user && context) {
			// did this instead of using the defaultValues prop to avoid funky type gymnastics.
			// Try using defaultValues and you'll see what I mean
			const dbValues: FieldValues = {
				fullName: context.fullName,
				email: user.email,
				phoneNumber: context.phoneNumber,
				dateOfBirth: context.dateOfBirth,

				country: context.country,
				region: context.region,
				postalCode: context.postalCode,

				linkedInProfile: context.linkedInProfile,
			};

			Object.keys(dbValues).forEach((key) => {
				setValue(key, dbValues[key]);
			});
		}
	}, [user, context]);

	const formValues = watch();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			const res = await updateTalentProfile(
				{
					...data,
					profileCompletionStatus: {
						personalInfo: true,
						educationExperience: profileCompletionStatus.educationExperience,
						preferences: profileCompletionStatus.preferences,
						assessment: profileCompletionStatus.assessment,
                        spotlight: true,
						overallComplete: profileCompletionStatus.overallComplete,
					},
				},
				user.id,
			);
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

	return (
		<form className="flex w-full max-w-xl flex-1 flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
			<FormSnapshot isDirty={isDirty} formValues={formValues} setValue={setValue} snapshotName={SNAPSHOT_NAME} />

			<div className="text-md font-semibold">Spotlight</div>
			<p className="text-muted-foreground">
				Questions that employers will definitely use to decide wether to engage with you or not
			</p>
			<div>
				<Label htmlFor="bio">Bio</Label>
				<Textarea
					id="bio"
					{...register("bio", { required: "Bio is required" })}
					placeholder="Write a short bio about yourself"
				/>
				{errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
			</div>

			<div>
				<Label htmlFor="highPotentialAnswer">What makes you a high-potential candidate?</Label>
				<Textarea
					id="highPotentialAnswer"
					{...register("highPotentialAnswer", { required: "This field is required" })}
					placeholder="Describe why you are a high potential candidate"
				/>
				{errors.highPotentialAnswer && <p className="text-red-500 text-sm">{errors.highPotentialAnswer.message}</p>}
			</div>

			<div>
				<Label htmlFor="challengeAnswer">Describe a challenge you faced in an academic or professional  setting and how you overcame it.</Label>
				<Textarea
					id="challengeAnswer"
					{...register("challengeAnswer", { required: "This field is required" })}
					placeholder="Describe a challenge you overcame"
				/>
				{errors.challengeAnswer && <p className="text-red-500 text-sm">{errors.challengeAnswer.message}</p>}
			</div>

		</form>
	);
}
