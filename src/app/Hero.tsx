"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SplitLandingPage() {
	const [hoveredSide, setHoveredSide] = useState<"talent" | "employer" | null>(null);

	return (
		<div className="flex h-screen flex-col overflow-hidden md:flex-row">
			{/* Talent Side */}
			<div className={cn("relative h-1/2 w-full overflow-hidden transition-all duration-500 ease-in-out md:h-full md:w-1/2", hoveredSide === "talent" ? "z-10 md:w-[55%]" : hoveredSide === "employer" ? "md:w-[45%]" : "md:w-1/2")} onMouseEnter={() => setHoveredSide("talent")} onMouseLeave={() => setHoveredSide(null)}>
				{/* Background Image */}
				{/* <div className={cn("absolute inset-0 bg-cover bg-center transition-transform duration-500", hoveredSide === "talent" ? "scale-105" : "scale-100")} style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }} /> */}

				{/* Overlay */}
				<div className={cn("absolute inset-0 bg-neutral-100 transition-opacity duration-500", hoveredSide === "talent" ? "opacity-30" : hoveredSide === "employer" ? "opacity-6;0" : "opacity-4,0")} />

				{/* Content */}
				<div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
					<Users className="animate-float mb-6 h-16 w-16 rounded-lg bg-neutral-50 p-3 text-neutral-700 shadow" />
					<h2 className={cn("mb-4 text-3xl font-bold transition-all duration-500 md:text-4xl lg:text-5xl", hoveredSide === "talent" ? "scale-110" : "scale-100")}>For Talents</h2>
					<p className={cn("mb-8 max-w-md text-lg transition-all duration-500 md:text-xl text-muted-foreground", hoveredSide === "talent" ? "opacity-100" : "opacity-70")}>Showcase your skills and find your dream job. Create a free profile and get discovered by top employers.</p>
					<Link href="/auth/sign-up?account-type=talent">
						<Button size="lg" className={cn("shadow-lg transition-all duration-500 ", hoveredSide === "talent" ? "scale-110" : "scale-100")}>
							Join as Talent
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>

			{/* Employer Side */}
			<div className={cn("relative h-1/2 w-full overflow-hidden transition-all duration-500 ease-in-out md:h-full md:w-1/2", hoveredSide === "employer" ? "z-10 md:w-[55%]" : hoveredSide === "talent" ? "md:w-[45%]" : "md:w-1/2")} onMouseEnter={() => setHoveredSide("employer")} onMouseLeave={() => setHoveredSide(null)}>
				{/* Background Image */}
				{/* <div className={cn("absolute inset-0 bg-cover bg-center transition-transform duration-500", hoveredSide === "employer" ? "scale-105" : "scale-100")} style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }} /> */}

				{/* Overlay */}
				<div className={cn("absolute inset-0 bg-primary/80 transition-opacity duration-500", hoveredSide === "employer" ? "opacity-70" : hoveredSide === "talent" ? "opacity-90" : "opacity-80")} />

				{/* Content */}
				<div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
					<Building className="animate-float mb-6 h-16 w-16 rounded-lg bg-white p-3 text-primary shadow-lg" />
					<h2 className={cn("mb-4 text-3xl font-bold transition-all duration-500 md:text-4xl lg:text-5xl text-primary-950", hoveredSide === "employer" ? "scale-110" : "scale-100")}>For Employers</h2>
					<p className={cn("mb-8 max-w-md text-white text-lg transition-all duration-500 md:text-xl", hoveredSide === "employer" ? "opacity-100" : "opacity-70")}>Find the perfect candidates for your company. Search, engage, and hire top talent with our powerful platform.</p>
					<Link href="/auth/sign-up?account-type=employer">
						<Button size="lg" variant="outline" className={cn("shadow-lg transition-all duration-500 ", hoveredSide === "employer" ? "scale-110" : "scale-100")}>
							Hire Talent
							<Building className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
