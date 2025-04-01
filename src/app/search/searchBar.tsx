"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";

import { Car, Menu, Sliders, Telescope, View } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { industries, companyTypes } from "@/lib/shared";

export default function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [q, setQ] = useState(searchParams.get("q") || "");
	const [areSearchFiltersOpen, setSearchFilters] = useState(false);
	const { register, handleSubmit, control } = useForm();

	useEffect(() => {
        if (q.length < 3) return;
        // Debounce the search input
		let handler = setTimeout(() => {
		router.replace(`/search?q=${q}`); // or push, choose what you like.
		}, 500);
		return () => {
			clearTimeout(handler);
		};
	}, [q]);

	return (
		<div className="relative">
			<div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
				<div className="relative max-w-md flex-1 md:block xl:max-w-2xl">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<svg className="h-5 w-5 text-neutral-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
						</svg>
						<span className="sr-only">Search icon</span>
					</div>
					<input value={q} onChange={(e)=>setQ(e.target.value)} type="text" className="peer block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 pl-10 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Search by interest, company name, skills, location etc" />
				</div>
				<div className="flex items-center justify-end gap-2">
					<button
						onClick={() => {
							setSearchFilters(!areSearchFiltersOpen);
						}}
						className="rounded-lg border p-2 hover:bg-accent"
					>
						<Sliders className="size-5 text-muted-foreground" />
					</button>
					<Select>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Sort By" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="popular">Popular</SelectItem>
							<SelectItem value="relevance">Relevance</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="relative w-full">
				{areSearchFiltersOpen && (
					<div className="absolute inset-x-0 top-5 flex flex-col gap-4 border bg-background p-5">
						<div className="text-lg font-semibold">Search Filters:</div>
						<form className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
							<div>
								<Label>Industry</Label>
								<div className="space-y-2">
									<Controller
										name="industryInterests"
										control={control}
										defaultValue={[]}
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

							{/* Position Preferences */}
							<div>
								<Label>Company size</Label>
								<Controller
									control={control}
									name="preferredCompanyTypes"
									rules={{
										required: "Please select at least one company type",
									}}
									render={({ field, fieldState }) => (
										<>
											<div className="space-y-2">
												{companyTypes.map((companyType) => (
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

							{/* Work Type Preferences */}
							<div>
								<Label>Position</Label>
								<Controller
									name="workTypePreference"
									control={control}
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
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
