"use client";

import { Package } from "lucide-react";

import { Search } from "lucide-react";

import { Button } from "./ui/button";

import { usePathname } from "next/navigation";

const routes = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Search",
		href: "/search",
	},
	{
		label: "Messages",
		href: "/messages",
	},
];

export default function Navbar() {
	const pathname = usePathname() || "/";

	return (
		<nav className="bg-white border-neutral-200 px-2 sm:px-4 shadow-lg z-10 flex">
			{/* <div className="w-full flex flex-wrap items-center justify-between mx-auto md:mx-0"> */}
			<div className="flex flex-1 justify-between items-center">
				<a href="/" className="flex items-center">
					<Package className="w-7 h-7 !my-0 mr-2" />

					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Wira</span>
				</a>
				<div className="flex gap-10 h-full">
					{routes.map((route, index) => {
						if (route.href == pathname) {
							return (
								<a key={index} href="" className="flex items-center h-full text-primary relative after:content-[''] after:absolute after:top-full after:-translate-y-0.5 after:-translate-x-1/2 after:left-1/2 after:w-[200%] after:h-1 after:bg-primary after:rounded">
									{route.label}
								</a>
							);
						} else {
							return (
								<a key={index} href="" className="flex items-center h-full">
									{route.label}
								</a>
							);
						}
					})}
				</div>
			</div>

			{/* <div className="relative hidden flex-1 mx-5 md:block max-w-md">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg className="w-5 h-5 text-neutral-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
						</svg>
						<span className="sr-only">Search icon</span>
					</div>
					<input type="text" className="peer block outline-none w-full p-2 pl-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search..." />
				</div> */}

			<div className="flex-1 flex justify-end py-2.5">
				{/* <div className="flex">
					<Avatar config={{ url: $user.photoURL }} />
					
					<button
						className="hidden sm:block px-3 py-2 font-semibold text-neutral-700 dark:text-neutral-50 rounded-lg">Log out</button
					>
				</div> */}
				{/* if not signed in */}

				<div className="flex svg:mr-2">
					{/* <a href={`/auth?continueUrl=${$page.url.pathname}`}> */}
					<a href="#">
						<Button className="bg-primary text-white" size={"lg"}>
							Sign Up
						</Button>
					</a>
				</div>
				{/* <button type="button" className="inline-flex items-center p-2 text-sm text-neutral-500 rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600" aria-controls="navbar-search" aria-expanded="false">
						<span className="sr-only">Open menu</span>
						<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
						</svg>
					</button> */}
			</div>

			{/* </div> */}
		</nav>
	);
}
