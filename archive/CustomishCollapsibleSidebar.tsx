// deprecated: Removed as it was causing layout shifts, wasn't clean 
// and needed hackey code to have the trigger with good ux on mobile

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useContext } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

import { PanelLeftClose, PanelLeft, Check } from "lucide-react";

import { TalentProfileContext } from "./talent/context";

import { Settings } from "lucide-react";

import type { ProfileCompletion } from "@/types/dashboard";

export default function Sidebar({ sections, title }: { sections: { label: string; href: string; completionProperty: string }[]; title?: string }) {
	const pathname = usePathname();

	const context = useContext(TalentProfileContext) || null;

	const profileCompletionStatus = context?.profileCompletionStatus as any;

	return (
		<Collapsible defaultOpen={true} className="group inset-y-0 left-0 z-10 flex flex-col gap-2 rounded-l-xl border-r bg-muted data-[state='open']:absolute md:!static">
			<div className="flex items-center rounded-tl-xl border-b bg-neutral-100 px-5 py-3 group-data-[state='open']:px-10">
				<CollapsibleTrigger className="=grid cursor-pointer place-content-center rounded p-1 hover:bg-neutral-200">
					<PanelLeft size={18} />
				</CollapsibleTrigger>
				<div className="hidden h-full items-center gap-2 group-data-[state='open']:flex">
					<div data-orientation="vertical" role="none" className="mx-2 h-full w-[1px] shrink-0 bg-neutral-300"></div>
					<h1 className="text-base font-medium">{title}</h1>
				</div>
			</div>
			{/* the CollapsibleContent class seems redundant but it is there to enable the sliding animation */}
			<CollapsibleContent className="CollapsibleContent h-full flex flex-col">
				<ul className="flex flex-col gap-0.5">
					{sections.map((section, index) => (
						<Link key={index} prefetch={true} href={section.href} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-none px-10 py-5 font-normal hover:bg-neutral-200", pathname?.includes(section.href) ? "bg-neutral-300 hover:bg-neutral-200" : "")}>
							<li className="relative flex w-full items-center">
								{profileCompletionStatus[section.completionProperty] && <Check className="absolute -left-6 text-emerald-700" />}
								{section.label}
							</li>
						</Link>
					))}
				</ul>
				<ul className="flex flex-col flex-1 justify-end ">
					<Link prefetch={true} href={"settings"} className={cn(buttonVariants({ variant: "ghost" }), "mt-auto !flex h-14 w-full items-center justify-start rounded-bl-xl px-10 font-normal hover:bg-neutral-200", pathname?.includes("settings") ? "bg-neutral-300 hover:bg-neutral-200" : "")}>
						<li className="relative flex w-full items-center gap-2">
							<Settings size={32} className="absolute -left-6 top-1/2 -translate-y-1/2" />
							Account Settings
						</li>
					</Link>
				</ul>
			</CollapsibleContent>

			{/*  scraped. causes layout shifts */}

			{/* <div className="hidden flex-col group-data-[state='closed']:flex">
				<ul className="flex flex-col gap-2">
					{sections.map((section, index) => (
						<Link key={index} prefetch={true} href={section.href} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-none font-normal hover:bg-neutral-200", pathname?.includes(section.href) ? "bg-neutral-300 hover:bg-neutral-200" : "")}>
							<li className="flex w-full items-center justify-center">
								{profileCompletionStatus[section.completionProperty] && <Check className="text-emerald-700" />}
							</li>
						</Link>
					))}
				</ul>
			</div> */}
		</Collapsible>
	);
}
