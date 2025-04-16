"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { Car, Menu, Sliders, Telescope, View } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { isObjectEmpty, cn } from "@/lib/utils";
import { industries, companyTypes } from "@/lib/shared";

function removeUndefinedValues(obj: any) {
	return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== undefined && value !== "" && (Array.isArray(value) || typeof value == "string") && value?.length > 0));
}

export default function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [formValues, setFormValues] = useState({
		q: searchParams.get("q") || "",
		sortBy: searchParams.get("sortBy") || "",
		industryInterests: searchParams.getAll("industryInterests").length > 0 ? searchParams.get("industryInterests")?.split(",") : [],
		preferredCompanyTypes: searchParams.getAll("preferredCompanyTypes").length > 0 ? searchParams.get("preferredCompanyTypes")?.split(",") : [],
		workTypePreference: searchParams.get("workTypePreference") || "",
	});

	const [areSearchFiltersOpen, setSearchFilters] = useState(false);

	let formValuesWithoutQ=formValues as any;
	delete formValuesWithoutQ.q;
	const appliedFilters = Object.keys(removeUndefinedValues(formValues));
	// const previousValues = useRef(formValues);

	useEffect(() => {
		// if (deepEqual(formValues, previousValues.current)) return;

		// previousValues.current = formValues;

		// Debounce the search input

		if (isObjectEmpty(formValues)) return;

		console.log("not-empty");

		let handler = setTimeout(() => {
			router.replace(`/search?${new URLSearchParams(removeUndefinedValues(formValues) as any).toString()}`);
		}, 500);
		return () => {
			clearTimeout(handler);
		};
	}, [formValues]);

	const handleInputChange = (field: string, value: any) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
	};

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
					<input type="text" value={formValues.q} onChange={(e) => handleInputChange("q", e.target.value)} className="peer block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 pl-10 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Search by interest, company name, skills, location etc" />
				</div>
				<div className="flex items-center justify-end gap-2">
					<button
						onClick={() => {
							setSearchFilters(!areSearchFiltersOpen);
						}}
						className={cn("rounded-lg border p-2 text-muted-foreground hover:bg-accent", appliedFilters.length > 0 && "flex items-center gap-1 text-primary")}
					>
						{appliedFilters.length > 0 && <span className="grid h-4 w-4 place-content-center rounded-full bg-primary text-xs text-white">{appliedFilters.length}</span>}
						<Sliders className="size-5 text-inherit" />
					</button>
					{/* <Select value={formValues.sortBy} onValueChange={(value) => handleInputChange("sortBy", value)}>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Sort By" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="popular">Popular</SelectItem>
							<SelectItem value="relevance">Relevance</SelectItem>
						</SelectContent>
					</Select> */}
				</div>
			</div>
			<div className="relative w-full">
				{areSearchFiltersOpen && (
					<div className="absolute inset-x-0 top-10 z-20 flex flex-col gap-4 rounded-xl border bg-background p-5">
						<div className="text-lg font-semibold">Search Filters:</div>
						<div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
							<div>
								<Label>Industry</Label>
								<div className="space-y-2">
									{industries.map((industry) => (
										<div key={industry.value} className="flex items-center">
											<Checkbox
												id={industry.value}
												checked={formValues.industryInterests?.includes(industry.value)}
												onCheckedChange={(checked) => {
													const updatedValue = checked ? [...(formValues.industryInterests || []), industry.value] : formValues.industryInterests?.filter((item) => item !== industry.value);
													handleInputChange("industryInterests", updatedValue);
												}}
											/>
											<Label htmlFor={industry.value} className="ml-2">
												{industry.label}
											</Label>
										</div>
									))}
								</div>
							</div>

							<div>
								<Label>Company size</Label>
								<div className="space-y-2">
									{companyTypes.map((companyType) => (
										<div key={companyType} className="flex items-center">
											<Checkbox
												checked={formValues.preferredCompanyTypes?.includes(companyType)}
												onCheckedChange={(checked) => {
													const updatedValue = checked ? [...(formValues.preferredCompanyTypes||[]), companyType] : formValues.preferredCompanyTypes?.filter((item) => item !== companyType);
													handleInputChange("preferredCompanyTypes", updatedValue);
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
							</div>

							<div>
								<Label>Position</Label>
								<RadioGroup value={formValues.workTypePreference} onValueChange={(value) => handleInputChange("workTypePreference", value)}>
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
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
