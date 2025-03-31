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
				<SearchResults query={q} />
			</Suspense>
		</div>
	);
}
