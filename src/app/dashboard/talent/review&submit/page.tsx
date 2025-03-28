"use client";

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

import { industries, workEnvironments, teamDynamics } from "@/lib/shared";

export default function Page() {
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
	});

	const onSubmit: SubmitHandler<Record<string, any>> = (data) => {
		console.log(data);

		// Handle submission logic here
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex max-w-xl flex-1 flex-col gap-5 p-10">
			<h3 className="text-md font-semibold">Consent and Declaration</h3>
			<div className="flex items-center space-x-2">
				<Checkbox
					id="consentToShare"
					{...register("consentToShare", {
						required: "Consent is required",
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
						required: "Declaration is required",
					})}
				/>
				<Label htmlFor="declarationOfAuthenticity">
					I declare that the information provided is true and accurate to the best of my knowledge <span className="text-red-500">*</span>
				</Label>
			</div>
			{errors.declarationOfAuthenticity && <p className="text-red-500">{errors.declarationOfAuthenticity.message?.toString()}</p>}

			<h3 className="text-md font-semibold">Feedback</h3>
			<div>
				<Label>How did you hear about this platform?</Label>
				<Controller
					name="hearAboutUs"
					control={control}
					render={({ field }) => (
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
					)}
				/>
				{errors.hearAboutUs && <p className="text-red-500">{errors.hearAboutUs.message?.toString()}</p>}
			</div>
			<div>
				<Label htmlFor="feedback">Do you have any feedback on this platform?</Label>
				<Textarea id="feedback" {...register("feedback")}/>
			</div>
		</form>
	);
}
