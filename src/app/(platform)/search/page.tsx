import { Suspense } from "react";

import SearchBar from "./searchBar";
import SearchResults from "./searchResults";

import { Skeleton } from "@/components/ui/skeleton";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Candidate search results",
};

// TODO:

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	let q = ((await searchParams).q as string) || "";
	let preferredCompanyTypes = ((await searchParams).preferredCompanyTypes as string)?.split(",") || [];
	let workTypePreference = ((await searchParams).workTypePreference as string) || "";
	let industryInterests = ((await searchParams).industryInterests as string)?.split(",") || [];
	// let sortBy= ((await searchParams).sortBy as string) as "newest" | "oldest" | "popular" | "relevance" || "relevance";

	return (
		<div className="flex h-full flex-1 flex-col gap-5 bg-background p-5 md:px-20 xl:px-36">
			<div>
				<h1 className="text-2xl font-semibold">Search</h1>
				<p className="text-sm text-muted-foreground">Find your next candidate. Use the search filters below to narrow down your search.</p>
			</div>

			<SearchBar />
			<hr />
			<Suspense
				fallback={
					<div className="grid gap-5 sm:grid-cols-3 md:grid-cols-4">
						{Array.from({ length: 3 }, (_, i) => (
							<Skeleton key={i} className="flex w-full h-44 flex-col gap-2 rounded-xl border p-3"></Skeleton>
						))}
					</div>
				}
			>
				{/* <SearchResults query={q} filters={{
					sortBy,
					preferredCompanyTypes,
					workTypePreference,
					industryInterests,
				}}/> */}
				<SearchResults query={q} filters={{
					preferredCompanyTypes,
					workTypePreference,
					industryInterests,
				}}/>
			</Suspense>
		</div>
	);
}
