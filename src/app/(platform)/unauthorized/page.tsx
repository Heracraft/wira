// replaced by /errors/401 but will be kept for now.
// Just in case.

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title:"Unauthorized",
	description:"Sorry, the page/resource you’re looking for is inacessible."
};

export default function Page() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className={cn("flex flex-col items-center p-5")}>
				<p className="text-base font-semibold text-primary">401</p>
				<h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Unauthorized</h1>
				<p className="mt-6 text-pretty text-lg font-medium text-neutral-500 sm:text-xl/8">Sorry, the page/resource you’re looking for is inacessible.</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a href={"/"}>
						<Button className="my-2" size={"lg"}>
							Back Home
						</Button>
					</a>
					<a href="mailto:admin@tu-fund.com" target="_blank" rel="noopener noreferrer">
						<Button variant="outline" size={"lg"}>
							Contact support
						</Button>
					</a>
				</div>
			</div>
		</div>
	);
}
