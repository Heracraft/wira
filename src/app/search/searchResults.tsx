import Link from "next/link";
import { Suspense } from "react";

import { sql, and, eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProfiles, educationEntries } from "@/db/schema";
import type { EducationEntry } from "@/db/schema";

import EducationTable from "@/components/EducationTable";
import ExperienceTable from "@/components/ExperienceTable";
import ProfilePicture from "@/components/ProfilePicture";

import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { Telescope, View } from "lucide-react";

import { cn } from "@/lib/utils";

interface PreviewProfile {
	avatarUrl: string;
	fullName: string;
	profileId: string;
	userId: string;
	country: string;
	region: string;
	skills: string[];
	education: EducationEntry;
}

export default async function SearchResults({ query, filters }: { query: string; filters: { [key: string]: any } }) {
	let searchResults;
	if (query) {
		searchResults = await db
			.select({
				avatarUrl: talentProfiles.avatarUrl,
				fullName: talentProfiles.fullName,
				profileId: talentProfiles.profileId,
				userId: talentProfiles.userId,
				country: talentProfiles.country,
				region: talentProfiles.region,
				skills: talentProfiles.skills,
				education: {
					degree: educationEntries.degree,
					major: educationEntries.major,
					startDate: educationEntries.startDate,
					institution: educationEntries.institution,
					endDate: educationEntries.endDate,
				},
			})
			.from(talentProfiles)
			.leftJoin(educationEntries, eq(educationEntries.profileId, talentProfiles.profileId))
			.where(and(sql`"searchVector" @@ plainto_tsquery(${query})`, sql.raw(`"profileCompletionStatus"->>'overallComplete' = 'true'`)))
			.limit(30);
		// since one applicant can have multiple education entries, the left join will return multiple rows for the same applicant.
		// we need to order them by the end date and get their latest education entry
		// this means education.endDate must be a number (year)
		// thats this
	} else {
		searchResults = await db
			.select({
				avatarUrl: talentProfiles.avatarUrl,
				fullName: talentProfiles.fullName,
				profileId: talentProfiles.profileId,
				userId: talentProfiles.userId,
				country: talentProfiles.country,
				region: talentProfiles.region,
				skills: talentProfiles.skills,
				education: {
					degree: educationEntries.degree,
					major: educationEntries.major,
					startDate: educationEntries.startDate,
					institution: educationEntries.institution,
					endDate: educationEntries.endDate,
				},
			})
			.from(talentProfiles)
			.leftJoin(educationEntries, eq(educationEntries.profileId, talentProfiles.profileId))
			.where(sql.raw(`"profileCompletionStatus"->>'overallComplete' = 'true'`))
			.limit(30);
	}
	// const searchResults = await new Promise((resolve) => setTimeout(() => resolve([]), 20000));

	searchResults = searchResults.reduce((acc: any, curr: any) => {
		const existing = acc.find((item: any) => item.profileId === curr.profileId);
		if (!existing) {
			acc.push(curr);
		} else if (curr.education.endDate > existing.education.endDate) {
			const index = acc.indexOf(existing);
			acc[index] = curr;
		}
		return acc;
	}, []);

	searchResults = searchResults as PreviewProfile[];

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
					<Sheet key={result.fullName}>
						<SheetTrigger asChild>
							<div
								className="flex aspect-square h-fit flex-col justify-end gap-2 rounded-xl border !bg-cover p-2 hover:cursor-pointer hover:bg-neutral-50 hover:shadow"
								style={{
									backgroundImage: `url(${result.avatarUrl})`,
								}}
							>
								{/* <div className="flex items-center gap-2"> */}
								{/* <ProfilePicture className="size-8" fullName={result.fullName as string} avatarUrl={result.avatarUrl as string} /> */}
								<div className="flex flex-col gap-2 rounded-xl border bg-neutral-50 p-2 backdrop-blur-sm">
									<div className="space-y-0.5">
										<h6 className="text-base font-semibold">{result.fullName}</h6>
										<p className="text max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
											{result.education.major} at {result.education.institution}
										</p>
										<p className="text max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
											{result.country} - {result.region}
										</p>
									</div>
									{/* </div> */}
									{result?.skills && result?.skills.length > 0 && (
										<div className="flex gap-2 overflow-hidden">
											{result.skills.map((skill) => (
												<span key={skill} className="text-neutral-800. shrink-0 rounded-full bg-neutral-200 px-2 py-1 text-xs">
													{skill}
												</span>
											))}
										</div>
									)}
								</div>
								{/* <div className="flex justify-end gap-2">
										<Button variant="ghost" className="gap-2" size={"icon"}>
											<Telescope />
										</Button>
							</div> */}
							</div>
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
									<EducationTable profileId={parseInt(result.profileId)} limit={1} />
								</Suspense>
								<Suspense fallback={<Skeleton className="h-32 w-full" />}>
									<ExperienceTable profileId={parseInt(result.profileId)} limit={1} />
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
