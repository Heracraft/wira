import Link from "next/link";
import { Suspense } from "react";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { talentProfiles } from "@/db/schema";
import { Telescope, View } from "lucide-react";

import EducationTable from "@/components/EducationTable";
import ExperienceTable from "@/components/ExperienceTable";
import ProfilePicture from "@/components/ProfilePicture";

import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default async function SearchResults({ query }: { query: string }) {
	const searchResults = await db
		.select()
		.from(talentProfiles)
		.where(sql`"searchVector" @@ plainto_tsquery(${query})`)
		.limit(30);
	// const searchResults = await new Promise((resolve) => setTimeout(() => resolve([]), 20000));

	return (
		<div className="flex h-full flex-col gap-2 bg-background">
			<h5 className="mb-2 text-lg font-medium underline underline-offset-2">Canditate results: {searchResults.length}</h5>
			{searchResults.length === 0 && (
				<div className="flex h-full flex-col items-center justify-center gap-5">
					<Telescope className="h-20 w-20 text-muted-foreground" />
					<p className="text-lg font-medium text-muted-foreground">No results found</p>
					<p className="text-sm text-muted-foreground">Try searching with different keywords.</p>
				</div>
			)}
			<div className="grid gap-5 sm:grid-cols-3 md:grid-cols-4">
				{searchResults.map((result) => (
					<div key={result.fullName} className="flex h-fit flex-col gap-2 rounded-xl border p-3">
						<div className="flex items-center gap-2">
							<ProfilePicture className="size-8" fullName={result.fullName as string} avatarUrl={result.avatarUrl as string} />
							<div className="space-y-0.5">
								<h6 className="text-base font-semibold">{result.fullName}</h6>
								<p className="text-sm text-muted-foreground">
									{result.country} - {result.region}
								</p>
							</div>
						</div>
						{result?.skills && result?.skills.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{result.skills.map((skill) => (
									<span key={skill} className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-800">
										{skill}
									</span>
								))}
							</div>
						)}
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
										<SheetDescription>View some candidate details before fully engaging with them.</SheetDescription>
									</SheetHeader>
									<div className="flex flex-col gap-10 py-5">
										<div className="flex gap-4">
											<ProfilePicture className="size-20" fullName={result.fullName as string} avatarUrl={result.avatarUrl as string} />

											<div className="flex flex-col gap-1">
												<h3 className="text-lg font-semibold">{result.fullName}</h3>
												<p className="text-sm text-muted-foreground">
													{result.country} - {result.region}
												</p>
												{result?.skills && result?.skills.length > 0 && (
													<div className="flex flex-wrap gap-2">
														{result.skills.map((skill) => (
															<span key={skill} className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-800">
																{skill}
															</span>
														))}
													</div>
												)}
											</div>
										</div>
										<Suspense fallback={<Skeleton className="h-32 w-full" />}>
											<EducationTable profileId={result.profileId} limit={1} />
										</Suspense>
										<Suspense fallback={<Skeleton className="h-32 w-full" />}>
											<ExperienceTable profileId={result.profileId} limit={1} />
										</Suspense>

										<TooltipProvider>
											<Tooltip>
												<Link href={`/profile/${result.userId}`} className="w-full">
													<TooltipTrigger asChild>
														<Button size={"lg"}>View Full Profile</Button>
													</TooltipTrigger>
												</Link>
												<TooltipContent>This will count as a egagement</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function Table({ title, headerItems, items }: { title: string; headerItems: string[]; items: string[] }) {
	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-lg font-semibold">{title}</h3>
			<div className="relative overflow-x-auto">
				<table className="w-full border text-left text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
					<thead className="bg-neutral-50 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-400">
						<tr className="">
							{headerItems.map((item) => (
								<th key={item} scope="col" className="border-b px-6 py-3">
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
							{items.map((item) => (
								<td key={item} className="px-6 py-4">
									{item}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
