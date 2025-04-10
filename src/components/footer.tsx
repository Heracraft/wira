"use client";

import { usePathname } from "next/navigation";

import { Mail } from "lucide-react";

const footerLinks = [
	{
		label: "Prodcut",
		links: [
			{
				label: "Features",
				href: "/",
			},
			{
				label: "Pricing",
				href: "/",
			},
		],
	},
	// {
	// 	label: "Resources",
	// 	links: [
	// 		{
	// 			label: "Blog",
	// 			href: "/",
	// 		},
	// 		{
	// 			label: "User guides",
	// 			href: "/",
	// 		},
	// 		{
	// 			label: "Webnairs",
	// 			href: "/",
	// 		},
	// 	],
	// },
	{
		label: "Company",
		links: [
			{
				label: "About us",
				href: "/",
			},
			{
				label: "Contact us",
				href: "/",
			},
		],
	},
	// {
	// 	label: "Pricing & Hiring",
	// 	links: [
	// 		{
	// 			label: "Personal",
	// 			href: "/",
	// 		},
	// 		{
	// 			label: "Start up",
	// 			href: "/",
	// 		},
	// 		{
	// 			label: "Organization",
	// 			href: "/",
	// 		},
	// 	],
	// },
];

export default function Footer() {
	const pathname = usePathname();

	if (pathname!="/" && pathname!="/pricing") return

	return (
		<footer className="bg-white py-20 border-t p-3">
			{/* <div className="flex flex-col items-center gap-4 mb-10">
				<h3 className="text-xl md:text-2xl font-semibold text-center">Subscribe to our news letter</h3>
				<div className="flex w-full max-w-xs sm:max-w-sm border border-r-0 rounded-md text-sm md:text-base">
					<Mail className="size-4 my-auto ml-4 mr-2 hidden sm:block" />
					<input type="email" placeholder="Enter your email" className="p-2 flex-1" />
					<button className="bg-primary text-white rounded-r-md px-4">Subscribe</button>
				</div>
			</div> */}
			<div className=" grid justify-self-center grid-cols-2 sm:grid-cols-4 gap-y-5 md:gap-20 flex-wrap">
				{footerLinks.map((item, index) => (
					<div key={index} className="flex flex-col gap-5">
						<h4 className="text-base font-semibold">{item.label}</h4>
						{item.links.map((link, index) => (
							<a key={index} href={link.href} className="text-sm text-muted-foreground font-medium">
								{link.label}
							</a>
						))}
					</div>
				))}
			</div>
		</footer>
	);
}
