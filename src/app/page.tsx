import Link from "next/link";

// import imageUrlBuilder from "@sanity/image-url";

// import { sanityClient } from "@/lib/store.server";

// import MultiMediaPortableTextRenderer from "@/components/portableTextRenderer";

import { Button } from "@/components/ui/button";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Header from "@/components/Header";
import Hero from "./Hero"

import { CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";

// import type { Metadata } from "next";
// import type { TypedObject } from "@portabletext/types";

// const query = `*[_type=="page" && slug.current=="/"]{description,body, "testimonials":*[_type=='testimonial']{title, testimonial, 'person':person->{title,image, name}}}`;

// const pageContent = (await sanityClient.fetch(query))[0] as PageContent;

// const testimonials = pageContent.testimonials;

// export const metadata: Metadata = {
// 	description: pageContent.description,
// }

// export type Testimonial = {
// 	title: string;
// 	testimonial: string;
// 	person: {
// 		title: string;
// 		image: {
// 			_type: string;
// 			asset: {
// 				_ref: string;
// 				_type: string;
// 			};
// 		};
// 		name: string;
// 	};
// };

// type PageContent = {
// 	description: string;
// 	body: TypedObject[];
// 	testimonials: Testimonial[];
// };

const accountTypes = [
	{
		label: "Employer account",
		description: "For bussinesses looking to hire",
		value: "employer",
	},
	{
		label: "Talent account",
		description: "For aspiring talents looking for a job",
		value: "talent",
	},
	{
		label: "Government account",
		description: "For government agencies looking to hire",
		value: "government",
	},
];

export default async function Home() {
	// const builder = imageUrlBuilder(sanityClient);

	return (
		<main className="flex flex-col overflow-x-hidden relative">
			<Header className="flex-1 absolute inset-x-0 top-0 bg-white/70 backdrop-blur-md"/>
			<Hero/>
			{/* <div className="relative flex min-h-full flex-1 flex-col items-center justify-center border-b md:px-20">
				<div className="bg-dots z-0" />
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>

				<div className="relative z-20 space-y-10 flex flex-col items-center px-2 sm:px-0">
					<h2 className="text-center text-3xl font-semibold md:text-5xl">Empowering Connections Between Top Talent and Leading Employers</h2>
					<p className="text-center text-muted-foreground max-w-prose">Discover opportunities, build careers, and find the perfect match with Wira – the ultimate platform for talents and employers.</p>
					<div className="flex flex-wrap justify-center gap-5">
						<CTAButton variant="default">Join us now</CTAButton>
					</div>
				</div>
			</div> */}

			<div id="aboutUs" className="flex flex-col [&>*]:px-5 [&>*]:md:px-20 [&>*]:xl:px-36">
				{/* For Talents Section */}
				<section className="w-full h-[100dvh] grid place-items-center bg-white">
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

				{/* For Employers Section */}
				<section className="h-[100dvh] grid place-items-center bg-neutral-50">

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
				{/* <div className="prose prose-neutral !max-w-none md:prose-xl">
				<MultiMediaPortableTextRenderer body={pageContent.body} />
			</div> */}
				{/* <div id="aboutUs" className="prose prose-neutral mt-14 flex !max-w-none flex-col items-center justify-center gap-14 md:prose-xl prose-headings:!m-0 prose-p:m-0">
					<div className="flex flex-col items-center gap-5">
						<h2 className="text-2xl font-semibold md:text-5xl">App Highlights</h2>
						<p className="text-muted-foreground">Discover top talent and career opportunities with ease, tailored to your preferences.</p>
					</div>
					<div className="flex flex-col flex-wrap items-center sm:flex-row">
						<div className="flex flex-1 flex-col gap-5">
							<h2 className="text-lg font-semibold">Start Matching</h2>
							<p className="max-w-sm">Our Al-driven algorithm connects you with the best candidates or jobs based on your unique profile.</p>
							<div className="flex gap-5">
								<CTAButton variant="outline">Get started today</CTAButton>
							</div>
						</div>
						<div className="mt-4 flex-1 sm:mt-0">
							<img src="/media/hr.jpg" alt="Hiring" className="rounded-xl" />
						</div>
					</div>
					<div className="flex flex-col flex-wrap items-center sm:flex-row-reverse">
						<div className="flex flex-1 justify-end">
							<div className="flex flex-col gap-5">
								<h2 className="text-lg font-semibold">Career Insights</h2>
								<p className="max-w-sm">Gain valuable career insights and industry trends to make informed decisions.</p>
								<div className="flex gap-5">
									<CTAButton variant="outline">Join us</CTAButton>
								</div>
							</div>
						</div>
						<div className="mt-4 flex-1 sm:mt-0">
							<img src="https://cdn.sanity.io/images/jsu955sa/production/c9ffba661b4690c6060d70a7c12d25ef0cda5e07-6016x4016.jpg" alt="Hiring" className="max-w-[80%]/ rounded-xl" />
						</div>
					</div>
				</div> */}
				{/* <div className="mt-24 flex flex-col items-center gap-5">
				<h2 className="text-center text-3xl font-semibold md:text-4xl">Hear from our awsome users!</h2>
				<div className="flex/ gap-5">
					<Carousel opts={{ loop: true }} className="max-w-xs md:max-w-none">
						<CarouselContent>
							{testimonials.map((item) => (
								<CarouselItem key={item.title} className="!max-w-full basis-auto sm:basis-1/2 md:basis-1/3">
									<div className="flex h-full !max-w-full flex-col gap-5 rounded-lg border bg-neutral-100 p-5">
										<div className="flex items-center gap-5">
											<img src={builder.image(item.person.image?.asset).url()} alt={item.person.name} className="aspect-square h-10 rounded-full" />
											<div className="flex flex-col">
												<h3 className="text-lg font-semibold">{item.person.name}</h3>
												<div className="text-muted-foreground">{item.person.title}</div>
											</div>
										</div>
										<p className="line-clamp-3">{item.testimonial}</p>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<div className="hidden md:flex">
							<CarouselPrevious />
							<CarouselNext />
						</div>
					</Carousel>
				</div>
			</div> */}
			</div>
			<section className="relative py-20 border border-dashed bg-primary-100">
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

function CTAButton({ children, variant }: { children?: React.ReactNode; variant?: "default" | "secondary" | "outline" }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={cn("md:w-56", variant == "default" ? "text-white" : "")} size={"lg"} variant={variant}>
					{children}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>What kind of account would you like to open??</DialogTitle>
				</DialogHeader>
				<div className="grid w-full grid-cols-2 justify-center gap-5 px-5">
					{accountTypes.map((accountType, index) => {
						if (accountType.value === "government") {
							return (
								<Link href="mailto:admin@tu-fund.com" target="_blank" key={index} className="flex flex-1 flex-col justify-between gap-2 rounded-lg border p-4 shadow-sm hover:border-primary-300">
									<span className="font-medium">{accountType.label}</span>
									<p className="text-xs text-muted-foreground">{accountType.description}</p>
								</Link>
							);
						}
						return (
							<Link href={`/auth/sign-up?account-type=${accountType.value}`} key={index} className="flex flex-1 flex-col justify-between gap-2 rounded-lg border p-4 shadow-sm hover:border-primary-300">
								{/* <BriefcaseBusiness size={48} className="ring-foreground" /> */}
								<span className="font-medium">{accountType.label}</span>
								<p className="text-xs text-muted-foreground">{accountType.description}</p>
							</Link>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
}
