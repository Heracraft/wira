"use client";
import Link from "next/link";
import { useState } from "react";

import { Car, Menu, Sliders, Telescope, View } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { skills } from "@/db/schema";

const filters = [
	{
		label: "Location",
		items: [
			{ label: "Remote", value: "remote" },
			{ label: "Onsite", value: "onsite" },
			{ label: "Hybrid", value: "hybrid" },
		],
	},
	{
		label: "Experience Level",
		items: [
			{ label: "Entry Level", value: "entry" },
			{ label: "Mid Level", value: "mid" },
			{ label: "Senior Level", value: "senior" },
		],
	},
	{
		label: "Industry",
		items: [
			{ label: "Tech", value: "tech" },
			{ label: "Finance", value: "finance" },
			{ label: "Healthcare", value: "healthcare" },
		],
	},
	{
		label: "Skills",
		items: [
			{ label: "Web Development", value: "web" },
			{ label: "Data Science", value: "data" },
			{ label: "Machine Learning", value: "ml" },
			{ label: "CPA", value: "cpa" },
		],
	},
];

const searchResults = [
	{
		name: "John Doe",
		location: "Remote",
		experience: "Mid Level",
		skills: ["Web Development", "Data Science"],
	},
	{
		name: "Jane Smith",
		location: "Onsite",
		experience: "Senior Level",
		skills: ["Machine Learning", "CPA"],
	},
	{
		name: "Alice Johnson",
		location: "Hybrid",
		experience: "Entry Level",
		skills: ["Web Development", "Machine Learning"],
	},
	{
		name: "Millie Bobby Brown",
		location: "Remote",
		experience: "Mid Level",
		skills: ["Data Science", "CPA"],
	},
];

export default function Page() {
	const [areSearchFiltersOpen, setSearchFilters] = useState(false);

	return (
		<div className="flex flex-col p-5 md:px-20 xl:px-36 bg-background gap-5">
			<div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between w-full">
				<div className="flex-1 relative md:block max-w-md xl:max-w-2xl">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg className="w-5 h-5 text-neutral-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
						</svg>
						<span className="sr-only">Search icon</span>
					</div>
					<input type="text" className="peer block outline-none w-full p-2 pl-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search..." />
				</div>
				<div className="flex justify-end gap-2 items-center">
					<button
						onClick={() => {
							setSearchFilters(!areSearchFiltersOpen);
						}}
						className="rounded-lg hover:bg-accent p-2 border"
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
			{areSearchFiltersOpen && (
				<div className="gap-4 flex flex-col bg-background">
					<div className="text-lg font-semibold">Search Filters:</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
						{filters.map((filter) => (
							<div key={filter.label} className="flex flex-col font-medium gap-2">
								<h5 className="text-base">{filter.label}</h5>
								{filter.items.map((item) => (
									<div key={item.value} className="flex items-center">
										<Checkbox id={item.value} className="text-white" />
										<label htmlFor={item.value} className="ml-2 text-sm font-medium text-neutral-900 dark:text-neutral-300">
											{item.label}
										</label>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			)}
			<div className="flex flex-col gap-2 bg-background">
				<h5 className="text-lg font-medium">Canditate resutls</h5>
				<div className="grid sm:grid-cols-3 md:grid-cols-4 gap-5 xl:gap-10">
					{searchResults.map((result) => (
						<div key={result.name} className="border rounded-xl p-3 gap-2 flex flex-col h-fit">
							<div className="space-y-0.5">
								<h6 className="text-base font-semibold">{result.name}</h6>
								<p className="text-muted-foreground text-sm">
									{result.location} - {result.experience}
								</p>
							</div>
							<div className="aspect-video w-full bg-purple-500"></div>
							<div className="flex gap-2 flex-wrap">
								{result.skills.map((skill) => (
									<span key={skill} className="shrink-0 px-2 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs">
										{skill}
									</span>
								))}
							</div>
							<div className="flex justify-end gap-2">
								<Sheet>
									<SheetTrigger asChild>
										<Button variant="ghost" className="gap-2" size={"icon"}>
											<Telescope />
										</Button>
									</SheetTrigger>
									<SheetContent side={"bottom"} className="h-[90vh] overflow-y-auto md:px-20 xl:px-48">
										<SheetHeader>
											<SheetTitle>Preview Candidate Profile</SheetTitle>
											<SheetDescription>View and manage candidate details.</SheetDescription>
										</SheetHeader>
										<div className="flex flex-col gap-10 py-5">
											<div className="flex gap-4">
												<img src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" className="rounded-full aspect-square h-20" />
												<div className="flex flex-col gap-1">
													<h3 className="text-lg font-semibold">John Doe</h3>
													<p className="text-muted-foreground text-sm">Remote - Mid Level</p>
													<div className="flex gap-2 flex-wrap">
														{result.skills.map((skill) => (
															<span key={skill} className="shrink-0 px-2 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs">
																{skill}
															</span>
														))}
													</div>
												</div>
											</div>
											<Table title="Education" headerItems={["Degree", "Institution", "Year", "Actions"]} items={["BSc Computer Science", "University of Example", "2020"]} />
											<Table title="Experience" headerItems={["Role", "Company", "Duration", "Actions"]} items={["Software Engineer", "Tech Corp", "2 years"]} />
											<div className="space-y-3">
												<h3 className="text-lg font-semibold">Additional Information</h3>
												<p className="max-w-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam necessitatibus quibusdam excepturi optio nobis voluptates eum explicabo molestiae. Enim temporibus praesentium sequi sunt quia voluptates perspiciatis, labore quisquam eaque eligendi?</p>
											</div>
											<Link href="/candidate-profile" className="w-full">
												<Button>View Full Profile</Button>
											</Link>
										</div>
									</SheetContent>
								</Sheet>
								<Button variant="ghost" about="awdadw" className="gap-2" size={"icon"}>
									<View />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function Table({ title, headerItems, items }: { title: string; headerItems: string[]; items: string[] }) {
	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-lg font-semibold">{title}</h3>
			<div className="relative overflow-x-auto">
				<table className="border w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400">
					<thead className="text-xs text-neutral-700 bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400">
						<tr className="">
							{headerItems.map((item) => (
								<th key={item} scope="col" className="px-6 py-3 border-b">
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className="bg-white dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200">
							{items.map((item) => (
								<td key={item} className="px-6 py-4">
									{item}
								</td>
							))}
								<td className="px-6 py-4">
									<Button variant="ghost">
										View details
									</Button>
								</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
