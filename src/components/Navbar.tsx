"use client";
import Link from "next/link";
import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import UserMenu from "./UserMenu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

import { createClient, userStore } from "@/lib/store";

import type { User } from "@/types";

type Route = {
	label: string;
	href: string;
	for: "all" | "employer" | "talent";
	restricted?: boolean;
};

const routes: Route[] = [
	{
		label: "Home",
		href: "/",
		for: "all",
	},
	{
		label: "Dashboard",
		href: "/dashboard",
		for: "all",
		restricted: true,
	},
	{
		label: "Search",
		href: "/search",
		for: "employer",
		restricted: true,
	},
	{
		label: "Pricing",
		href: "/pricing",
		for: "all",
	},
];

export default function Navbar({ children, hidePricing }: { children: React.ReactNode; hidePricing?: boolean }) {
	const pathname = usePathname() || "/";

	const user = userStore((state) => state.user);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// console.log({userType:user})

	return (
		<>
			<div className="hidden gap-10 md:flex">
				{routes.map((route, index) => {
					if ((route.restricted && !user) || (route.for != user?.userType && route.for != "all")) {
						// check if the route is restricted and the user is not logged in
						// or if the route is for a specific user type and the current user type does not match
						// in this case, we return null to not render the route
						return null;
					} else if ((route.label == "Pricing" && user?.userType == "talent") || (route.label == "Pricing" && hidePricing == true)) return null;

					if (pathname == route.href || (route.href != "/" && pathname.startsWith(route.href))) {
						return (
							<Link key={index} href={route.href} className="relative flex h-full w-20 items-center justify-center text-center text-primary after:absolute after:left-1/2 after:top-full after:h-1 after:w-[130%] after:-translate-x-1/2 after:-translate-y-0.5 after:rounded after:bg-primary after:content-['']">
								{route.label}
							</Link>
						);
					} else {
						return (
							<Link prefetch={true} key={index} href={route.href} className="flex h-full w-20 items-center justify-center text-center">
								{route.label}
							</Link>
						);
					}
				})}
			</div>
			{isMobileMenuOpen && (
				<div className="absolute inset-x-0 top-full z-40 bg-background px-2 pb-4 md:hidden">
					<div className="flex flex-col gap-3 rounded-lg border p-2">
						{routes.map((route, index) => {
							if ((route.restricted && !user) || (route.for != user?.userType && route.for != "all")) {
								return null;
							}
							if (pathname == route.href || (route.href != "/" && pathname.startsWith(route.href))) {
								return (
									<Link onClick={()=>setIsMobileMenuOpen(false)} key={index} href={route.href} className="flex w-full items-center rounded bg-primary px-3 py-2 text-white">
										{route.label}
									</Link>
								);
							} else {
								return (
									<Link onClick={()=>setIsMobileMenuOpen(false)} key={index} href={route.href} className="flex w-full items-center rounded px-3 py-2 hover:bg-primary-200">
										{route.label}
									</Link>
								);
							}
						})}
						{/* [x]: include /dashboard and search routes with conditions to them */}
					</div>
				</div>
			)}
			<div className="flex items-center justify-end py-2.5">
				<div className="flex gap-2">
					{/* <a href={`/auth?continueUrl=${$page.url.pathname}`}> */}
					{user && user.userType ? (
						<>{children}</>
					) : (
						<>
							<Link href="/auth/sign-up" prefetch={true}>
								{/* 2 different buttons of 2 different sizes for small vs large screens */}
								<Button className="hidden bg-primary text-white sm:block" size={"lg"}>
									Sign Up
								</Button>
							</Link>
							<Link href={"/auth/"} prefetch={true}>
								<Button size={"lg"} variant={"outline"}>
									Log in
								</Button>
							</Link>
						</>
					)}
					<button className="block rounded p-2 hover:bg-accent md:hidden" onClick={() => toggleMobileMenu()}>
						<Menu className="size-6 text-muted-foreground" />
					</button>
				</div>
			</div>
		</>
	);
}

export function SignOutDropdownItem() {
	const supabase = createClient();
	const router = useRouter();

	return (
		<DropdownMenuItem
			onClick={async () => {
				await supabase.auth.signOut();
				router.refresh();
			}}
		>
			Sign Out
		</DropdownMenuItem>
	);
}
