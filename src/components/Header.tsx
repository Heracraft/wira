import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import UserMenu from "./UserMenu";

import { Skeleton } from "./ui/skeleton";

import {cn} from "@/lib/utils";

export default async function Header({className}: {className?: string}) {
	return (
		<nav className={cn("relative z-20 flex justify-between border-neutral-200 bg-white px-2 shadow sm:px-4",className)}>
			{/* <div className="w-full flex flex-wrap items-center justify-between mx-auto md:mx-0"> */}
			<a href="/" className="flex items-center py-1">
				<img src="/logo.svg" className="!my-0 mr-2 size-16" />
			</a>

			<Navbar>
				<Suspense fallback={<Skeleton className="size-10 rounded-lg" />}>
					<UserMenu />
				</Suspense>
			</Navbar>
		</nav>
	);
}
