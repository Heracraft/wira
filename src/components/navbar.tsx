"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { use, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

import { Menu, Package } from "lucide-react";

import { userStore } from "@/lib/store";

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
];

export default function Navbar() {
	const pathname = usePathname() || "/";

	const user = userStore((state) => state.user);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav className="bg-white border-neutral-200 px-2 sm:px-4 shadow z-10 flex relative">
			{/* <div className="w-full flex flex-wrap items-center justify-between mx-auto md:mx-0"> */}
			<div className="flex flex-1 justify-between items-center">
				<a href="/" className="flex items-center">
					<Package className="w-7 h-7 !my-0 mr-2" />

					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Wira</span>
				</a>
				<div className="gap-10 h-full hidden md:flex">
					{routes.map((route, index) => {
						if ((route.restricted && !user) || (route.for != user?.userType && route.for != "all")) {
							return null;
						}
						if (route.href == pathname) {
							return (
								<Link key={index} href={route.href} className="flex items-center h-full text-primary relative after:content-[''] after:absolute after:top-full after:-translate-y-0.5 after:-translate-x-1/2 after:left-1/2 after:w-[200%] after:h-1 after:bg-primary after:rounded">
									{route.label}
								</Link>
							);
						} else {
							return (
								<Link key={index} href={route.href} className="flex items-center h-full">
									{route.label}
								</Link>
							);
						}
					})}
					
				</div>
			</div>
			{isMobileMenuOpen && (
				<div className="absolute top-full inset-x-0 bg-background md:hidden  px-2 pb-4">
					<div className="flex flex-col gap-3 p-2 border rounded-lg">
						{routes.map((route, index) => {
							if ((route.restricted && !user) || route.for != user?.userType) {
								return null;
							}
							if (route.href == pathname) {
								return (
									<Link key={index} href={route.href} className="flex items-center bg-primary text-white w-full px-3 py-2 rounded">
										{route.label}
									</Link>
								);
							} else {
								return (
									<Link key={index} href={route.href} className="flex items-center hover:bg-primary-200 w-full px-3 py-2 rounded">
										{route.label}
									</Link>
								);
							}
						})}
						{/* [x]: include /dashboard and search routes with conditions to them */}
					</div>
				</div>
			)}

			<div className="flex-1 flex items-center justify-end py-2.5">
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
							<DropdownMenuContent className="w-36">
								<DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
								<DropdownMenuItem asChild>
									<Link href={`/dashboard/${user.userType}`}>Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href="/settings">Settings</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link href="/auth/sign-out">Sign Out</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<a href="/auth/sign-up">
							<Button className="bg-primary text-white sm:hidden">Sign Up</Button>
							<Button className="bg-primary text-white hidden sm:block" size={"lg"}>
								Sign Up
							</Button>
						</a>
					)}
					<button className="rounded hover:bg-accent p-2 block md:hidden" onClick={() => toggleMobileMenu()}>
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
