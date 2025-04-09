"use client";

import dynamic from "next/dynamic";

import { useEffect, useContext, useState } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, Loader2 } from "lucide-react";

// import LocationInputs from "./LocationInputs";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";
import DatePickerInput from "@/components/DatePicker";
import SubmitButton from "@/components/submitButton";

import FormSnapshot from "../../FormSnapshots";

import { TalentProfileContext } from "../context";
import { userStore, createClient } from "@/lib/store";

import { updateTalentProfile } from "../../actions";

import { toast } from "sonner";

import type { ProfileCompletion } from "@/types/dashboard";

// Lazy load the LocationInputs component because all that location data is 22KB
const LazyLocationInputs = dynamic(() => import("./LocationInputs"), {
	loading: () => <Skeleton className="h-9 w-full rounded-md" />,
});

const SNAPSHOT_NAME = "form-snapshot-personal-info";

async function uploadAvatar(file: File, uid: string, fileName: string) {
	try {
		const supabase = createClient();
		const avatrPath = `avatars/${uid}-${fileName}`;
		const { error: uploadError } = await supabase.storage.from("static").upload(avatrPath, file, { upsert: true });

		if (uploadError) {
			throw new Error(uploadError.message);
		}

		// Generate the public URL for the uploaded file
		const { data: publicUrlData } = supabase.storage.from("static").getPublicUrl(avatrPath);

		if (publicUrlData) {
			return publicUrlData.publicUrl;
		}
	} catch (error: any) {
		console.log(error);

		throw new Error(error.message);
	}
}

export default function Page() {
	const user = userStore((state) => state.user);

	const context = useContext(TalentProfileContext);

	const [avatarUrl, setAvatarUrl] = useState(context?.avatarUrl);
	const [uploadStatus, setUploadStatus] = useState<"uploading" | "idle">("idle");

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
					dateOfBirth: data.dateOfBirth.toString(),
					profileCompletionStatus: {
						personalInfo: true,
						educationExperience: profileCompletionStatus.educationExperience,
						preferences: profileCompletionStatus.preferences,
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

			<div className="text-md font-semibold">Personal Info</div>
			<div className="flex w-full max-w-md flex-col gap-5">
				<div>
					<Label>Avatar</Label>
					<Controller
						control={control}
						name="avatarUrl"
						rules={{ required: "Avatar is required" }}
						render={({ field, fieldState }) => (
							<>
								<Avatar className="group relative size-28">
									{(() => {
										if (uploadStatus === "uploading") {
											return (
												<div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
													<Loader2 size={20} className="animate-spin" />
												</div>
											);
										} else {
											return (
												<>
													<label htmlFor="avatar">
														<div className="absolute inset-0 hidden place-content-center rounded-full bg-black/10 backdrop-blur-[2px] hover:cursor-pointer group-hover:grid">
															<ImagePlus size={20} className="text-muted" />
														</div>
													</label>
													<input
														id="avatar"
														type="file"
														className="sr-only"
														onChange={async (e) => {
															try {
																const avatar = e.target.files ? e.target.files[0] : null;
																if (!avatar || !context?.userId) return;

																if (avatar.size > 20 * 1024 * 1024) {
																	toast.error("File size must be less than 20MB");
																	return;
																}

																if (avatar.type !== "image/jpeg" && avatar.type !== "image/png") {
																	toast.error("File must be a JPG or PNG");
																	return;
																}

																const fileName = avatar.name;
																setUploadStatus("uploading");

																const avatarUrl = await uploadAvatar(avatar, context.userId, fileName);

																if (!avatarUrl) throw new Error("Error uploading avatar.");

																await updateTalentProfile({ avatarUrl }, context.userId);

																field.onChange(avatarUrl);
																setUploadStatus("idle");
																// const uid
															} catch (error) {
																console.log(error);
																toast.error("An error occurred, try again.");
															}
														}}
													/>
												</>
											);
										}
									})()}
									<AvatarImage src={avatarUrl || undefined} />
									<AvatarFallback className="text-2xl">
										{context?.fullName
											?.split(" ")
											.map((el) => el[0])
											.join("") || ""}
									</AvatarFallback>
								</Avatar>
								{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
							</>
						)}
					/>
				</div>
				<div>
					<Label htmlFor="fullName">
						Full Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="fullName"
						{...register("fullName", {
							required: "Full name is required",
						})}
					/>
					{errors.fullName && (
						<p role="alert" className="mt-1 text-xs text-destructive">
							{errors.fullName.message as string}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="date">
						Date of Birth <span className="text-red-500">*</span>
					</Label>
					<Controller control={control} name="dateOfBirth" render={({ field }) => <DatePickerInput date={field.value} setDate={field.onChange} />}></Controller>
				</div>
				<div>
					<Label htmlFor="email">
						Email Address <span className="text-red-500">*</span>
					</Label>
					<Input id="email" type="email" disabled {...register("email", { required: "Email is required" })} />
					{errors.email && (
						<p role="alert" className="mt-1 text-xs text-destructive">
							{errors.email.message as string}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="phoneNumber">
						Phone Number <span className="text-red-500">*</span>
					</Label>
					<Controller
						name="phoneNumber"
						control={control}
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
									<span role="alert" className="text-xs text-destructive">
										{errors.phoneNumber.message as string}
									</span>
								)}
							</>
						)}
					/>
				</div>
				<div>
					<Label htmlFor="linkedInProfile">LinkedIn Profile (optional)</Label>
					<Input id="linkedinProfile" {...register("linkedInProfile")} />
				</div>

				<LazyLocationInputs control={control} register={register} setValue={setValue} watch={watch} errors={errors} />
			</div>
			<div className="flex justify-end">
				<SubmitButton
					buttonState={{
						isSubmitting,
						isSubmitted,
						isSubmitSuccessful,
						isValid,
						isDirty,
					}}
					loadingText="Saving"
					children="Save"
					className="w-fit"
				/>
			</div>
		</form>
	);
}
