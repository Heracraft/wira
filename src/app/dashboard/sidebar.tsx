"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useContext } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

import { PanelLeftClose, PanelLeft, Check } from "lucide-react";

import { TalentProfileContext } from "./talent/context";
import { CompanyProfileContext } from "./employer/context";

import { Settings } from "lucide-react";

import type { ProfileCompletion } from "@/types/dashboard";

export default function Sidebar({ sections, title, isForMobile }: { sections: { label: string; href: string; completionProperty?: string }[]; title?: string; isForMobile: boolean }) {
	const pathname = usePathname();

	const context = useContext(TalentProfileContext) || useContext(CompanyProfileContext);

	const profileCompletionStatus = "profileCompletionStatus" in (context || {}) ? (context as { profileCompletionStatus: any }).profileCompletionStatus : undefined;

	return (
		<>
			{isForMobile ? (
				<div className="sticky top-0 z-10 block sm:hidden">
					<Sheet>
						<SheetTrigger className="flex h-12 w-full items-center gap-1 rounded-t-xl border-b border-dashed bg-muted px-2 py-2">
							<div className="grid h-full cursor-pointer place-content-center rounded p-1 hover:bg-neutral-200">
								<PanelLeft size={18} />
							</div>
							<div data-orientation="vertical" role="none" className="mx-1 h-full w-[1px] shrink-0 self-stretch bg-neutral-200"></div>
							<h1 className="text-base font-medium">{title}</h1>
						</SheetTrigger>
						<SheetContent className="flex-col gap-2 !px-0">
							<SheetHeader>
								<SheetTitle>{title}</SheetTitle>
								{/* <SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription> */}
							</SheetHeader>
							<div className="flex h-full flex-col">
								<ul className="flex flex-col gap-0.5">
									{sections.map((section, index) => (
										<Link key={index} prefetch={true} href={section.href} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-none px-10 py-5 font-normal hover:[&>li]:underline", pathname?.includes(section.href) ? "bg-neutral-200" : "")}>
											<li className="relative flex w-full items-center underline-offset-2">
												{section.completionProperty && profileCompletionStatus[section.completionProperty] && <Check className="absolute -left-6 text-emerald-700" />}
												{section.label}
											</li>
										</Link>
									))}
								</ul>
								<ul className="flex flex-1 flex-col justify-end rounded-bl-xl">
									<Link prefetch={true} href={"settings"} className={cn(buttonVariants({ variant: "ghost" }), "mt-auto !flex h-14 w-full items-center justify-start rounded-bl px-10 font-normal hover:[&>li]:underline", pathname?.includes("settings") ? "bg-neutral-200" : "")}>
										<li className="relative flex w-full items-center gap-2 underline-offset-2">
											<Settings size={32} className="absolute -left-6 top-1/2 -translate-y-1/2" />
											Account Settings
										</li>
									</Link>
								</ul>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			) : (
				<div className="group inset-y-0 left-0 z-10 hidden flex-col gap-2 rounded-l-xl border-r bg-muted sm:flex">
					<div className="flex items-center rounded-tl-xl border-b bg-neutral-100 px-10 py-3">
						<h1 className="text-base font-medium">{title}</h1>
					</div>
					<div className="flex h-full flex-col">
						<ul className="flex flex-col gap-0.5">
							{sections.map((section, index) => (
								<Link key={index} prefetch={true} href={section.href} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-none px-10 py-5 font-normal hover:[&>li]:underline", pathname?.includes(section.href) ? "bg-neutral-200" : "")}>
									<li className="relative flex w-full items-center underline-offset-2">
										{section.completionProperty && profileCompletionStatus[section.completionProperty] && <Check className="absolute -left-6 text-emerald-700" />}
										{section.label}
									</li>
								</Link>
							))}
						</ul>
						<ul className="flex flex-1 flex-col justify-end rounded-bl-xl">
							<Link prefetch={true} href={"settings"} className={cn(buttonVariants({ variant: "ghost" }), "mt-auto !flex h-14 w-full items-center justify-start rounded-bl px-10 font-normal hover:[&>li]:underline", pathname?.includes("settings") ? "bg-neutral-200" : "")}>
								<li className="relative flex w-full items-center gap-2 underline-offset-2">
									<Settings size={32} className="absolute -left-6 top-1/2 -translate-y-1/2" />
									Account Settings
								</li>
							</Link>
						</ul>
					</div>

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
				</div>
			)}
		</>
	);
}
