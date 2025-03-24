"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";

// import LocationInputs from "./LocationInputs";
import { PhoneInput } from "@/components/auth/PhoneNumberInput";
import DatePickerInput from "@/components/DatePicker";
import SubmitButton from "@/components/submitButton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the LocationInputs component because all that location data is 22KB
const LazyLocationInputs = dynamic(() => import("./LocationInputs"), {
	loading: () => <Skeleton className="h-9 w-full rounded-md" />,
});

import { userStore } from "@/lib/store";

export default function Page() {
	const user = userStore((state) => state.user);

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
	});

	useEffect(() => {
		if (user) {
			setValue("fullName", user.fullName);
			setValue("email", user.email);
			setValue("phoneNumber", user.phoneNumber);
			setValue("dateOfBirth", user.dateOfBirth);
		}
	}, [user]);
	return (
		<form className="flex flex-col p-10 gap-5 flex-1 max-w-xl" onSubmit={handleSubmit((data) => console.log(data))}>
			<div className="flex flex-col  gap-5 font-medium text-lg">Personal Info</div>
			<div className="flex flex-col gap-5 w-full max-w-md">
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
						<p role="alert" className="text-xs text-destructive mt-1">
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
						<p role="alert" className="text-xs text-destructive mt-1">
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
						defaultValue={user?.phoneNumber}
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
									<span role="alert" className="text-destructive text-xs">
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
						isSubmitting: false,
						isSubmitted: false,
						isSubmitSuccessful: false,
						isValid: true,
					}}
					loadingText="Saving"
					children="Save"
					className="w-fit"
				/>
			</div>
		</form>
	);
}
