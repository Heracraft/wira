"use client";

import { usePathname } from "next/navigation";

import { Mail, Phone } from "lucide-react";

export default function Footer() {
	const pathname = usePathname();

	if (pathname != "/" && pathname != "/pricing") return;

	return (
		<footer className="border-t bg-white p-3 py-20">
			{/* <div className="flex flex-col items-center gap-4 mb-10">
				<h3 className="text-xl md:text-2xl font-semibold text-center">Subscribe to our news letter</h3>
				<div className="flex w-full max-w-xs sm:max-w-sm border border-r-0 rounded-md text-sm md:">
					<Mail className="size-4 my-auto ml-4 mr-2 hidden sm:block" />
					<input type="email" placeholder="Enter your email" className="p-2 flex-1" />
					<button className="bg-primary text-white rounded-r-md px-4">Subscribe</button>
				</div>
			</div> */}
			<div className="grid grid-cols-1 flex-wrap gap-y-5 justify-self-center sm:grid-cols-4 md:gap-20 md:px-20">
				<div className="flex flex-col gap-5 sm:col-span-2">
					<img src="/logo.svg" alt="Wira logo" className="size-20" />
					<p className="">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam esse vero maxime nesciunt possimus at nisi molestias repellendus. Quas asperiores voluptate rerum porro doloremque quae ad ut nam unde nobis.</p>
				</div>
				<div className="flex flex-col gap-5">
					<h4 className=" font-semibold">Quick Links</h4>
					<a href="/" className="font-medium">
						Home
					</a>
					<a href="/pricing" className="font-medium">
						Pricing
					</a>
					<a href="/about" className="font-medium">
						About Us
					</a>
				</div>
				<div className="flex flex-col gap-5">
					<h4 className=" font-semibold">Contact us</h4>
					<a href="mailto:admin@tu-fund.com" className="flex items-center hover:underline underline-offset-2">
						<Mail className="mr-2 size-4" />
						admin@tu-fund.com
					</a>
					<a href="tel:555-123-4567" className="flex items-center hover:underline underline-offset-2">
						<Phone className="mr-2 size-4" />
						555-123-4567
					</a>
				</div>
			</div>
		</footer>
	);
}
