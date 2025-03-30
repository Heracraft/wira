"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Menu, Package } from "lucide-react";

import { revalidatePathFromClient } from "@/app/auth/actions";

import { createClient, userStore } from "@/lib/store";

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
	}
];

export default function Navbar() {
	const supabase = createClient();

	const pathname = usePathname() || "/";

	const user = userStore((state) => state.user);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav className="relative z-20 flex border-neutral-200 bg-white px-2 shadow sm:px-4">
			{/* <div className="w-full flex flex-wrap items-center justify-between mx-auto md:mx-0"> */}
			<div className="flex flex-1 items-center justify-between">
				<a href="/" className="flex items-center">
					<Package className="!my-0 mr-2 h-7 w-7" />

					<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Wira</span>
				</a>
				<div className="hidden h-full gap-10 md:flex">
					{routes.map((route, index) => {
						if ((route.restricted && !user) || (route.for != user?.userType && route.for != "all")) {
							// check if the route is restricted and the user is not logged in
							// or if the route is for a specific user type and the current user type does not match
							// in this case, we return null to not render the route
							return null;
						}
						if (pathname == route.href || (route.href != "/" && pathname.startsWith(route.href))) {
							return (
								<Link key={index} href={route.href} className="relative flex h-full w-20 items-center justify-center text-center text-primary after:absolute after:left-1/2 after:top-full after:h-1 after:w-[130%] after:-translate-x-1/2 after:-translate-y-0.5 after:rounded after:bg-primary after:content-['']">
									{route.label}
								</Link>
							);
						} else {
							return (
								<Link key={index} href={route.href} className="flex h-full w-20 items-center justify-center text-center">
									{route.label}
								</Link>
							);
						}
					})}
				</div>
			</div>
			{isMobileMenuOpen && (
				<div className="absolute inset-x-0 top-full z-20 bg-background px-2 pb-4 md:hidden">
					<div className="flex flex-col gap-3 rounded-lg border p-2">
						{routes.map((route, index) => {
							if ((route.restricted && !user) || (route.for != user?.userType && route.for != "all")) {
								return null;
							}
							if (pathname == route.href || (route.href != "/" && pathname.startsWith(route.href))) {
								return (
									<Link key={index} href={route.href} className="flex w-full items-center rounded bg-primary px-3 py-2 text-white">
										{route.label}
									</Link>
								);
							} else {
								return (
									<Link key={index} href={route.href} className="flex w-full items-center rounded px-3 py-2 hover:bg-primary-200">
										{route.label}
									</Link>
								);
							}
						})}
						{/* [x]: include /dashboard and search routes with conditions to them */}
					</div>
				</div>
			)}

			<div className="flex flex-1 items-center justify-end py-2.5">
				<div className="flex gap-2">
					{/* <a href={`/auth?continueUrl=${$page.url.pathname}`}> */}
					{user && user.fullName ? (
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarImage src={user.avatarUrl || undefined} />
									<AvatarFallback>
										{user.fullName
											.split(" ")
											.map((el) => el[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-44">
								<DropdownMenuLabel className="flex flex-col">
									{user.fullName}
									{user.userType == "employer" && <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">{user.companyName}</span>}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href={`/dashboard/${user.userType}`}>Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href={`/dashboard/${user.userType}/settings`}>Settings</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={async () => {
										await supabase.auth.signOut();
										revalidatePathFromClient("/", true);
									}}
								>
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<a href="/auth/sign-up">
							<Button className="bg-primary text-white sm:hidden">Sign Up</Button>
							<Button className="hidden bg-primary text-white sm:block" size={"lg"}>
								Sign Up
							</Button>
						</a>
					)}
					<button className="block rounded p-2 hover:bg-accent md:hidden" onClick={() => toggleMobileMenu()}>
						<Menu className="size-6 text-muted-foreground" />
					</button>
				</div>
			</div>
			{/* <button type="button" className="inline-flex items-center p-2 text-sm text-neutral-500 rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600" aria-controls="navbar-search" aria-expanded="false">
						<span className="sr-only">Open menu</span>
						<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
						</svg>
					</button> */}

			{/* </div> */}
		</nav>
	);
}
