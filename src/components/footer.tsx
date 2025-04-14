"use client";

import { usePathname } from "next/navigation";

import { Mail, Phone } from "lucide-react";

export default function Footer() {
	const pathname = usePathname();

	if (pathname != "/" && pathname != "/pricing") return;

	return (
		<footer className="border-t/ bg-white p-3 py-20  flex-grow-0">
			{/* <div className="flex flex-col items-center gap-4 mb-10">
				<h3 className="text-xl md:text-2xl font-semibold text-center">Subscribe to our news letter</h3>
				<div className="flex w-full max-w-xs sm:max-w-sm border border-r-0 rounded-md text-sm md:">
					<Mail className="size-4 my-auto ml-4 mr-2 hidden sm:block" />
					<input type="email" placeholder="Enter your email" className="p-2 flex-1" />
					<button className="bg-primary text-white rounded-r-md px-4">Subscribe</button>
				</div>
			</div> */}
			<div className="grid grid-cols-1 flex-wrap gap-y-5 justify-self-center sm:grid-cols-4 md:gap-20 md:px-20">
				<div className="flex flex-col items-start gap-3 sm:col-span-2">
					<img src="/text-logo.svg" alt="Wira logo" className="h-12" />
					<p className="text-muted-foreground">Discover and connect with top professionals worldwide through Wira. Explore personalized career insights, job opportunities, and candidate profiles. Join today to streamline hiring and career growth with smart filters and real-time updates.</p>
				</div>
				<div className="flex flex-col gap-5">
					<h4 className="font-semibold">Quick Links</h4>
					<a href="/" className="font-medium underline-offset-2 hover:underline">
						Home
					</a>
					<a href="/pricing" className="font-medium underline-offset-2 hover:underline">
						Pricing
					</a>
					<a href="/#aboutUs" className="font-medium underline-offset-2 hover:underline">
						About Us
					</a>
				</div>
				<div className="flex flex-col gap-5">
					<h4 className="font-semibold">Contact us</h4>
					<a href="mailto:admin@tu-fund.com" className="flex items-center underline-offset-2 hover:underline">
						<Mail className="mr-2 size-4" />
						admin@tu-fund.com
					</a>
					<a href="tel:555-123-4567" className="flex items-center underline-offset-2 hover:underline">
						<Phone className="mr-2 size-4" />
						555-123-4567
					</a>
				</div>
			</div>
		</footer>
	);
}
