"use client";
import { useState } from "react";

import { Controller } from "react-hook-form";
import type { Control, UseFormRegister, UseFormWatch, FieldValues, UseFormSetValue, FieldErrors } from "react-hook-form";

import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { countriesWithPostalCodes } from "@/lib/shared";

interface LocationInputsProps {
	watch: UseFormWatch<FieldValues>;
	register: UseFormRegister<FieldValues>;
	control: Control<FieldValues, any>;
	setValue: UseFormSetValue<FieldValues>;
	errors: FieldErrors<FieldValues>;
}

export default function LocationInputs({ watch, register, control, setValue, errors }: LocationInputsProps) {
	const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
	const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

	return (
		<>
			<div>
				<h4 className="text-base font-medium">Location</h4>
				<div className="mt-2">
					<Label htmlFor="location">
						Country <span className="text-red-500">*</span>
					</Label>
					<Controller
						name="country"
						control={control}
						rules={{ required: "Country is required" }}
						render={({ field, fieldState }) => (
							<>
								<CountryDropdown
									value={field.value}
									onChange={(val) => field.onChange(val)}
									customRender={({ options, ...selectProps }) => {
										return (
											<Popover open={isCountryDropdownOpen} onOpenChange={setIsCountryDropdownOpen}>
												<PopoverTrigger asChild>
													<Button variant={"outline"} className="w-full justify-start font-normal">
														{field.value || "Select a country"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="max-w-md p-0">
													<Command>
														<CommandInput placeholder="Search country..." />
														<CommandList>
															<CommandGroup>
																{options.map((option) => (
																	<CommandItem
																		key={option.key}
																		onSelect={() => {
																			field.onChange(option.label);
																			setValue("region", "");
																			setIsCountryDropdownOpen(false);
																		}}
																	>
																		{option.label}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
														<CommandEmpty>No results found.</CommandEmpty>
													</Command>
												</PopoverContent>
											</Popover>
										);
									}}
								/>
								{fieldState.error && (
									<span role="alert" className="text-xs text-destructive">
										{fieldState.error.message}
									</span>
								)}
							</>
						)}
					/>
				</div>
				<div className="mt-5">
					<Label htmlFor="location">
						Region/State <span className="text-red-500">*</span>
					</Label>
					<Controller
						name="region"
						control={control}
						rules={{ required: "Region is required" }}
						render={({ field, fieldState }) => (
							<>
								<RegionDropdown
									country={watch("country")}
									value={field.value}
									onChange={(val) => field.onChange(val)}
									customRender={({ options, ...selectProps }) => {
										return (
											<Popover open={isRegionDropdownOpen} onOpenChange={setIsRegionDropdownOpen}>
												<PopoverTrigger asChild>
													<Button variant={"outline"} className="w-full justify-start font-normal">
														{field.value || "Select a region"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="max-w-md p-0">
													<Command>
														<CommandInput placeholder="Search region..." />
														<CommandList>
															<CommandGroup>
																{options.map((option) => (
																	<CommandItem
																		key={option.key}
																		onSelect={() => {
																			field.onChange(option.label);
																			setIsRegionDropdownOpen(false);
																		}}
																	>
																		{option.label}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
														<CommandEmpty>No results found.</CommandEmpty>
													</Command>
												</PopoverContent>
											</Popover>
										);
									}}
								/>
								{fieldState.error && (
									<span role="alert" className="text-xs text-destructive">
										{fieldState.error.message}
									</span>
								)}
							</>
						)}
					/>
				</div>
			</div>

			{countriesWithPostalCodes.includes(watch("country")) && (
				<div>
					<Label htmlFor="postalCode">
						Postal/Zip Code <span className="text-red-500">*</span>
					</Label>
					<Input id="postalCode" {...register("postalCode", { required: "Postal code is required" })} />
					{errors.postalCode && (
						<p role="alert" className="mt-1 text-xs text-destructive">
							{errors.postalCode.message as string}
						</p>
					)}
				</div>
			)}
		</>
	);
}
