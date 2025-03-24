"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const sections = [
	{
		label: "Personal Information",
		href: "/dashboard/talent/personal-info",
	},
	{
		label: "Profile",
		href: "/dashboard/talent/profile",
	},
	// Account?: to edit email, password, avatar, etc.
];

export default function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	// console.log(pathname);
	// [ ]: Memoize?

	return (
		<>
			<ul className="flex flex-col border-r bg-neutral-100 py-10 gap-2 rounded-l-xl">
				{sections.map((section, index) => (
					<Link prefetch={true} href={section.href}>
						<li key={index} className={cn(buttonVariants({ variant: "ghost" }), "justify-start font-normal py-5 px-10 rounded-none w-full", pathname?.includes(section.href) ? "bg-neutral-200 hover:bg-neutral-300" : "")}>
							{section.label}
						</li>
					</Link>
				))}
			</ul>
			{children}
		</>
	);
}
