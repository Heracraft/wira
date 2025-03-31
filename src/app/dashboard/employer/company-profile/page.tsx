"use client";

import dynamic from "next/dynamic";

import { useEffect, useContext } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { toast } from "sonner";

// import LocationInputs from "./LocationInputs";
import SubmitButton from "@/components/submitButton";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { ChevronsUpDown } from "lucide-react";

import FormSnapshot from "../../FormSnapshots";

import { CompanyProfileContext } from "../context";
import { userStore } from "@/lib/store";

import { updateCompanyProfile } from "../../actions";

import { industries } from "@/lib/shared";


// Lazy load the LocationInputs component because all that location data is 22KB
const LazyLocationInputs = dynamic(() => import("./LocationInputs"), {
	loading: () => <Skeleton className="h-9 w-full rounded-md" />,
});

const SNAPSHOT_NAME = "form-snapshot-company-profile";

export default function Page() {
	const user = userStore((state) => state.user);

	const context = useContext(CompanyProfileContext);

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
				companyName: context.companyName,
				contactPersonName: context.contactPersonName,
				contactPersonPosition: context.contactPersonPosition,
				companyWebsite: context.companyWebsite,
				industry: context.industry,

				country: context.country,
				region: context.region,
				postalCode: context.postalCode,
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
			const res = await updateCompanyProfile(data, user.id);
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

			<h3 className="text-lg font-semibold">Company Info</h3>
			<div className="flex w-full max-w-md flex-col gap-5">
				<div>
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

				<div>
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

				<div>
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

				<div>
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
					<Label htmlFor="industry">Industry</Label>
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
			</div>

			<LazyLocationInputs control={control} register={register} setValue={setValue} watch={watch} errors={errors} />

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
