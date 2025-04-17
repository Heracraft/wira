import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Header from "@/components/Header";
import Hero from "./Hero";

import { CheckCircle } from "lucide-react";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	// const builder = imageUrlBuilder(sanityClient);

	// const [currentLandingPage, setCurrentLandingPage] = useState<"talent" | "employer" | null>(null);
	const currentLandingPage = (await searchParams).type;

	if (!currentLandingPage) {
		return (
			<main className="relative flex flex-col overflow-x-hidden">
				<Hero />
			</main>
		);
	}
	if (currentLandingPage === "talent") {
		return (
			<main className="relative flex flex-1 flex-col overflow-x-hidden">
				<Header />
				<CTA href="/auth/sign-up?account-type=talent">Join as Talent →</CTA>
				<div id="aboutUs" className="flex flex-col [&>*]:px-5 [&>*]:md:px-20 [&>*]:xl:px-36">
					{/* For Talents Section */}
					<section className="grid h-[100dvh] w-full place-items-center bg-white">
						<div className="container px-4 md:px-6">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
								<div className="flex items-center justify-center">
									<img src="/media/hr.jpg" width={450} height={450} alt="Talent Image" className="rounded-lg object-cover" />
								</div>
								<div className="flex flex-col justify-center space-y-4">
									<div className="space-y-2">
										<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">For Talents</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Dream Job Awaits</h2>
										<p className="max-w-[600px] text-neutral-500 md:text-xl">Looking to take the next step in your career? Wira connects you with top employers globally, offering personalized job recommendations based on your skills, experience, and preferences.</p>
									</div>
									<ul className="grid gap-3">
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Showcase your skills and experience with a professional profile.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Gain career insights and industry trends to make informed decisions.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Access tools to highlight your unique strengths and stand out to employers.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Start your journey today and let opportunities find you.</span>
										</li>
									</ul>
									<Link href="/auth/sign-up?account-type=talent" prefetch={true}>
										<Button size="lg" className="mt-4 bg-primary-600 hover:bg-primary-700">
											Join as Talent →
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		);
	}
	if (currentLandingPage === "employer") {
		return (
			<main className="relative flex flex-col overflow-x-hidden">
				<Header />
				<CTA
					href="/auth/sign-up?account-type=emplo
yer"
				>
					Hire Top Talent
				</CTA>
				<div id="aboutUs" className="flex flex-col [&>*]:px-5 [&>*]:md:px-20 [&>*]:xl:px-36">
					{/* For Employers Section */}
					<section className="grid h-[100dvh] place-items-center bg-neutral-50">
						<div className="container px-4 md:px-6">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
								<div className="order-2 flex flex-col justify-center space-y-4 lg:order-1">
									<div className="space-y-2">
										<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">For Employers</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find the Right Talent, Faster</h2>
										<p className="max-w-[600px] text-neutral-500 md:text-xl">Hiring the right talent has never been easier. Wira helps you discover and engage with top professionals tailored to your company’s needs.</p>
									</div>
									<ul className="grid gap-3">
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Access a global pool of qualified candidates.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Streamline your hiring process with smart tools and features.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Showcase your company profile to attract top talent.</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary-600" />
											<span>Build your dream team with Wira.</span>
										</li>
									</ul>
									<Link href={"/auth/sign-up?account-type=employer"} prefetch={true}>
										<Button size="lg" className="mt-4 bg-primary-600 hover:bg-primary-700">
											Hire Top Talent →
										</Button>
									</Link>
								</div>
								<div className="order-1 flex items-center justify-center lg:order-2">
									<img src="https://cdn.sanity.io/images/jsu955sa/production/c9ffba661b4690c6060d70a7c12d25ef0cda5e07-6016x4016.jpg" width={400} height={400} alt="Employer Image" className="rounded-lg object-cover" />
								</div>
							</div>
						</div>
					</section>
				</div>
				<section className="relative border border-dashed bg-primary-100 py-20">
					<div className="bg-grid-sm"></div>
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-100 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
					<div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
						<div className="mx-auto max-w-screen-sm text-center">
							<h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-white">Start your free trial today</h2>
							<p className="mb-6 font-light text-muted-foreground md:text-lg"> Experience Wira risk-free for 30 days and discover how it can transform the way you connect with and grow your talent pool.</p>
							<Link href="/auth/sign-up" prefetch={true}>
								<Button size={"lg"}>Free trial for 30 days</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		);
	}
}

function CTA({ children, href }: { children: React.ReactNode; href: string }) {
	return (
		<div className="relative flex h-[100dvh] flex-col items-center justify-center border-b md:px-20">
			<div className="bg-dots z-0" />
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>

			<div className="relative z-20 flex flex-col items-center space-y-10 px-2 sm:px-0">
				<h2 className="text-center text-3xl font-semibold md:text-5xl">Empowering Connections Between Top Talent and Leading Employers</h2>
				<p className="max-w-prose text-center text-muted-foreground">Discover opportunities, build careers, and find the perfect match with Wira – the ultimate platform for talents and employers.</p>
				<div className="flex flex-wrap justify-center gap-5">
					{/* <CTAButton variant="default">Join us now</CTAButton> */}
					<Link href={href} prefetch={true}>
						<Button size="lg" className="bg-primary-600 hover:bg-primary-700">
							{children}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
