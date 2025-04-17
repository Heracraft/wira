import Link from "next/link";

import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Header from "@/components/Header";
import Hero from "./Hero";
import { PricingCard } from "@/components/PricingCard";

import { CheckCircle, Star, Shield, Users, Search, Building, ArrowRight } from "lucide-react";

import { plans } from "@/lib/shared";
import type { Plan } from "@/types";

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
				<div className="relative flex h-[100dvh] flex-col items-center justify-center border-b md:px-10 xl:px-20">
					<div className="bg-dots z-0" />
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>

					<div className="relative z-20 flex w-full flex-col-reverse gap-5 px-5 md:flex-row md:items-center md:justify-between md:gap-0 md:px-0">
						<div className="mr-2 flex flex-col gap-4 md:max-w-sm xl:max-w-xl">
							<h2 className="text-3xl font-semibold md:text-5xl">Showcase Your Skills, Find Your Dream Job</h2>
							<p className="max-w-prose text-muted-foreground">Create a free profile on Wira and get discovered by top employers looking for talent like you.</p>
							<div className="flex flex-wrap gap-5">
								{/* <CTAButton variant="default">Join us now</CTAButton> */}
								<Link href="/auth/sign-up?account-type=talent" prefetch={true}>
									<Button size={"lg"} className="flex w-52 items-center gap-2">
										Create a free profile
										<ArrowRight />
									</Button>
								</Link>
								<Link href="#how-it-works">
									<Button variant="outline" size="lg" className="w-52">
										Learn how it works
									</Button>
								</Link>
							</div>
						</div>
						<div className="order-1 flex items-center justify-center lg:order-2">
							<img src="https://cdn.sanity.io/images/jsu955sa/production/c9ffba661b4690c6060d70a7c12d25ef0cda5e07-6016x4016.jpg" width={500} alt="Employer Image" className="rounded-lg object-cover" />
						</div>
					</div>
				</div>
				<div id="aboutUs" className="flex flex-col [&>*]:px-5 [&>*]:md:px-20">
					<section id="features" className="w-full bg-white py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Features</div>
									{/* <div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Features</div> */}

									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Talents Love Wira</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">Our platform is designed to help you showcase your true potential and connect with employers who value your unique skills.</p>
								</div>
							</div>
							<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<Users className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Comprehensive Profile</h3>
									<p className="text-center text-muted-foreground">Showcase your education, work experience, personality, and workplace preferences in one complete profile.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<Shield className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Privacy Control</h3>
									<p className="text-center text-muted-foreground">Your contact details remain private until an employer expresses genuine interest through an engagement.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<Star className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Better Matches</h3>
									<p className="text-center text-muted-foreground">Our personality assessment helps match you with companies where you'll truly thrive and belong.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<CheckCircle className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">100% Free</h3>
									<p className="text-center text-muted-foreground">Creating and maintaining your profile is completely free. We only charge employers for accessing detailed profiles.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<Users className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Quality Employers</h3>
									<p className="text-center text-muted-foreground">Connect with vetted employers who are serious about finding the right talent for their teams.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<div className="rounded-full bg-primary/10 p-3">
										<Star className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Career Growth</h3>
									<p className="text-center text-muted-foreground">Find opportunities that align with your career goals and help you grow professionally.</p>
								</div>
							</div>
						</div>
					</section>
					<section id="how-it-works" className="w-full bg-primary-50 py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Process</div>
									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How Wira Works for Talents</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">A simple four-step process to help you find your dream job.</p>
								</div>
							</div>
							<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">1</div>
									<h3 className="mb-2 text-xl font-bold">Create Your Profile</h3>
									<p className="text-muted-foreground">Sign up and build your comprehensive profile with personal info, education, and work experience.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">2</div>
									<h3 className="mb-2 text-xl font-bold">Complete Assessments</h3>
									<p className="text-muted-foreground">Answer personality questions and specify your ideal workplace preferences.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">3</div>
									<h3 className="mb-2 text-xl font-bold">Get Discovered</h3>
									<p className="text-muted-foreground">Employers will find you based on your qualifications and preferences.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">4</div>
									<h3 className="mb-2 text-xl font-bold">Connect &amp; Interview</h3>
									<p className="text-muted-foreground">When employers engage with your profile, you'll be notified to take the next steps.</p>
								</div>
							</div>
						</div>
					</section>
					<section id="faq" className="w-full py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">FAQ</div>
									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">Find answers to common questions about using Wira as a talent.</p>
								</div>
							</div>
							<div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-8">
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">Is Wira really free for talents?</h3>
									<p className="mt-2 text-muted-foreground">Yes, creating and maintaining a talent profile on Wira is completely free. We only charge employers for accessing detailed profiles and engagement features.</p>
								</div>
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">How does Wira protect my personal information?</h3>
									<p className="mt-2 text-muted-foreground">Your contact details and sensitive information are only revealed when an employer engages with your profile. You'll be notified when this happens, and you can choose to proceed or decline.</p>
								</div>
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">What kind of companies use Wira?</h3>
									<p className="mt-2 text-muted-foreground">Wira partners with a wide range of companies, from startups to large enterprises, across various industries. All employers are vetted to ensure quality opportunities.</p>
								</div>
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">How are personality assessments conducted?</h3>
									<p className="mt-2 text-muted-foreground">Our personality assessments consist of carefully designed questions that help identify your work style, communication preferences, and cultural fit factors that contribute to workplace success.</p>
								</div>
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">Can I update my profile after creating it?</h3>
									<p className="mt-2 text-muted-foreground">Yes, you can update your profile at any time. We encourage you to keep your information current to improve your chances of finding the right match.</p>
								</div>
								<div className="rounded-lg border border-primary/10 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
									<h3 className="text-lg font-semibold">How will I know if an employer is interested?</h3>
									<p className="mt-2 text-muted-foreground">You'll receive notifications when employers engage with your profile. You can then review their company information and decide if you want to proceed with the connection.</p>
								</div>
							</div>
						</div>
					</section>
					<section className="relative border border-dashed bg-primary-500 py-20">
						<div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
							<div className="mx-auto flex max-w-screen-sm flex-col items-center text-center">
								<h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-primary-950 dark:text-white">Ready to Find Your Dream Job?</h2>
								<p className="mb-6 font-light text-white md:text-lg">Join thousands of talents who have found their perfect match on Wira.</p>
								<Link href="/auth/sign-up?account-type=talent" prefetch={true}>
									<Button size={"lg"} variant={"secondary"} className="flex items-center gap-2">
										Create Free Profile
										<ArrowRight />
									</Button>
								</Link>
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

				<div className="relative flex h-[100dvh] flex-col items-center justify-center border-b md:px-20">
					<div className="bg-dots z-0" />
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>

					<div className="relative z-20 flex w-full items-center justify-between">
						<div className="flex max-w-xl flex-col gap-4 px-2 sm:px-0">
							<h2 className="text-3xl font-semibold md:text-5xl">Find Exceptional Talent For Your Team</h2>
							<p className="max-w-prose text-muted-foreground">Discover pre-screened candidates with comprehensive profiles that go beyond just skills and experience.</p>
							<div className="flex flex-wrap gap-5">
								{/* <CTAButton variant="default">Join us now</CTAButton> */}
								<Link href="/auth/sign-up?account-type=employer" prefetch={true}>
									<Button size={"lg"} className="flex items-center gap-2">
										Start hiring
										<ArrowRight />
									</Button>
								</Link>
								<Link href="#pricing">
									<Button variant="outline" size="lg">
										View pricing
									</Button>
								</Link>
							</div>
						</div>
						<div className="order-1 flex items-center justify-center lg:order-2">
							<img src="https://cdn.sanity.io/images/jsu955sa/production/c9ffba661b4690c6060d70a7c12d25ef0cda5e07-6016x4016.jpg" width={500} alt="Employer Image" className="rounded-lg object-cover" />
						</div>
					</div>
				</div>
				<div id="aboutUs" className="flex flex-col [&>*]:px-5 [&>*]:md:px-20">
					<section id="features" className="w-full bg-background py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									{/* <div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Features</div> */}
									<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Features</div>

									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Powerful Tools for Employers</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">Wira provides everything you need to find, evaluate, and connect with the perfect candidates.</p>
								</div>
							</div>
							<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<Search className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Advanced Search</h3>
									<p className="text-center text-muted-foreground">Powerful search tools to find candidates based on skills, experience, personality traits, and workplace preferences.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<Users className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Comprehensive Profiles</h3>
									<p className="text-center text-muted-foreground">View detailed talent profiles that include education, work experience, personality assessments, and workplace preferences.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<Star className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Engagement Tracking</h3>
									<p className="text-center text-muted-foreground">Track your interactions with potential candidates and manage your shortlisted talents efficiently.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<Building className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Company Profile</h3>
									<p className="text-center text-muted-foreground">Showcase your company culture and opportunities to attract the best talent in the market.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<Shield className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Quality Candidates</h3>
									<p className="text-center text-muted-foreground">Access pre-screened candidates with verified skills and experience to save your time.</p>
								</div>
								<div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:bg-neutral-50">
									<div className="rounded-full bg-primary/10 p-3">
										<CheckCircle className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold">Flexible Plans</h3>
									<p className="text-center text-muted-foreground">Choose from various pricing plans to match your hiring needs and budget constraints.</p>
								</div>
							</div>
						</div>
					</section>
					<section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Process</div>

									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How Wira Works for Employers</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">A simple four-step process to help you find the perfect candidates.</p>
								</div>
							</div>
							<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
								<div className="flex flex-col items-center text-center">
									<div className="text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">1</div>
									<h3 className="mb-2 text-xl font-bold">Create Company Profile</h3>
									<p className="text-muted-foreground">Sign up and provide information about your company and contact person.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">2</div>
									<h3 className="mb-2 text-xl font-bold">Search for Talent</h3>
									<p className="text-muted-foreground">Use our advanced search to find candidates that match your requirements.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">3</div>
									<h3 className="mb-2 text-xl font-bold">Engage with Profiles</h3>
									<p className="text-muted-foreground">View full profiles of promising candidates and access their complete information.</p>
								</div>
								<div className="flex flex-col items-center text-center">
									<div className="text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">4</div>
									<h3 className="mb-2 text-xl font-bold">Shortlist &amp; Contact</h3>
									<p className="text-muted-foreground">Shortlist your favorite candidates and reach out to them directly.</p>
								</div>
							</div>
						</div>
					</section>
					<section id="pricing" className="w-full bg-white py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									{/* <div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm">Pricing</div> */}
									<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Pricing</div>

									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Choose the Right Plan for Your Hiring Needs</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">Flexible pricing options designed to scale with your recruitment requirements.</p>
								</div>
							</div>

							<div className="mt-8 grid w-full grid-cols-1 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3">
								{plans.map((plan, index) => (
									<Suspense fallback={<div className="flex h-96 items-center justify-center">Loading...</div>}>
										<PricingCard key={index} plan={plan as Plan} />
									</Suspense>
								))}
							</div>
						</div>
					</section>
					<section id="faq" className="w-full bg-white py-12 md:py-24 lg:py-32">
						<div className="container px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									{/* <div className="text-primary-foreground inline-block rounded-lg bg-primary px-3 py-1 text-sm">FAQ</div> */}
									<div className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">FAQ</div>

									<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
									<p className="max-w-[900px] text-muted-foreground md:text-xl">Find answers to common questions about using Wira as an employer.</p>
								</div>
							</div>
							<div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-8">
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">How many engagements do I get with my plan?</h3>
									<p className="mt-2 text-muted-foreground">The number of engagements depends on your subscription plan. Starter plans include 5 engagements per month, Professional plans include 20, and Enterprise plans offer unlimited engagements.</p>
								</div>
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">What happens when I engage with a talent?</h3>
									<p className="mt-2 text-muted-foreground">When you engage with a talent, you gain access to their full profile including contact details. The talent is notified of your interest, and you can then communicate directly with them.</p>
								</div>
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">Can I upgrade or downgrade my plan?</h3>
									<p className="mt-2 text-muted-foreground">Yes, you can change your subscription plan at any time. Changes will take effect at the start of your next billing cycle.</p>
								</div>
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">How are talents vetted on Wira?</h3>
									<p className="mt-2 text-muted-foreground">All talents on Wira complete a comprehensive profile process that includes verification of their education and work experience. Our personality assessments also help ensure quality candidates.</p>
								</div>
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">What makes Wira different from other recruitment platforms?</h3>
									<p className="mt-2 text-muted-foreground">Wira focuses on comprehensive profiles that include not just skills and experience, but also personality traits and workplace preferences, ensuring better matches between talents and employers.</p>
								</div>
								<div className="rounded-lg border p-6">
									<h3 className="text-lg font-semibold">Is there a limit to how many talents I can shortlist?</h3>
									<p className="mt-2 text-muted-foreground">Shortlist limits depend on your plan. Starter plans allow up to 10 shortlisted talents, Professional plans allow up to 50, and Enterprise plans offer unlimited shortlisting.</p>
								</div>
							</div>
						</div>
					</section>
				</div>
				<section className="relative bg-primary-500 py-20">
					<div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
						<div className="mx-auto flex max-w-screen-sm flex-col items-center text-center">
							<h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-primary-950 dark:text-white">Ready to Transform Your Hiring Process?</h2>
							<p className="mb-6 font-light text-white md:text-lg"> Join Wira today and connect with exceptional talent for your team.</p>
							<Link href="/auth/sign-up?account-type=employer" prefetch={true}>
								<Button size={"lg"} variant={"secondary"} className="flex items-center gap-2">
									Start hiring
									<ArrowRight />
								</Button>
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
