"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({ sections }: { sections: { label: string; href: string }[] }) {
	const pathname = usePathname();

	return (
		<ul className="flex flex-col gap-2 rounded-l-xl border-r bg-neutral-100 py-10">
			{sections.map((section, index) => (
				<Link key={index} prefetch={true} href={section.href}>
					<li key={index} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-none px-10 py-5 font-normal", pathname?.includes(section.href) ? "bg-neutral-200 hover:bg-neutral-300" : "")}>
						{section.label}
					</li>
				</Link>
			))}
		</ul>
	);
}
