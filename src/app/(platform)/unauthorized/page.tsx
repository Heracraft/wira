import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function Page() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className={cn("flex flex-col items-center p-5")}>
				<p className="text-base font-semibold text-primary">401</p>
				<h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Unauthorized</h1>
				<p className="mt-6 text-pretty text-lg font-medium text-neutral-500 sm:text-xl/8">Sorry, the page/resource you’re looking for is inacessible.</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Button className="my-2" size={"lg"}>
						<Link href={"/dashboard"}>Back to dashboard</Link>
					</Button>
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
