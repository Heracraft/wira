import Link from "next/link";

// import imageUrlBuilder from "@sanity/image-url";

// import { sanityClient } from "@/lib/store.server";

// import MultiMediaPortableTextRenderer from "@/components/portableTextRenderer";

import { Button } from "@/components/ui/button";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
		<div className="flex flex-col gap-24 p-5 md:px-20 xl:px-36">
			<div className="mt-14 flex flex-col items-center justify-center space-y-10 md:px-20">
				<h2 className="text-3xl font-semibold md:text-5xl">Connect with Talent</h2>
				<p className="text-center text-muted-foreground">Discover and match with top professionals globally</p>
				<div className="flex flex-wrap justify-center gap-5">
					<CTAButton>Join us now</CTAButton>
					{/* <Link href={"mailto:admin@tu-fund.com"} target="_blank">
						<Button variant={"outline"} size={"lg"} className="border-primary text-primary">
							Request demo
						</Button>
					</Link> */}
				</div>
			</div>
			{/* <div className="prose prose-neutral !max-w-none md:prose-xl">
				<MultiMediaPortableTextRenderer body={pageContent.body} />
			</div> */}
			<div id="aboutUs" className="prose prose-neutral mt-14 flex !max-w-none flex-col items-center justify-center gap-14 md:prose-xl prose-headings:!m-0 prose-p:m-0">
				<div className="flex flex-col items-center gap-5">
					<h2 className="text-2xl font-semibold md:text-5xl">App Highlights</h2>
					<p className="text-muted-foreground">Discover top talent and career opportunities with ease, tailored to your preferences.</p>
				</div>
				<div className="flex flex-col flex-wrap items-center sm:flex-row">
					<div className="flex flex-1 flex-col gap-5">
						<h2 className="text-lg font-semibold">Start Matching</h2>
						<p className="max-w-sm">Our Al-driven algorithm connects you with the best candidates or jobs based on your unique profile.</p>
						<div className="flex gap-5">
							<CTAButton variant="secondary">Get started today</CTAButton>
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
								<CTAButton variant="secondary">Join us</CTAButton>
							</div>
						</div>
					</div>
					<div className="mt-4 flex-1 sm:mt-0">
						<img src="https://cdn.sanity.io/images/jsu955sa/production/c9ffba661b4690c6060d70a7c12d25ef0cda5e07-6016x4016.jpg" alt="Hiring" className="max-w-[80%]/ rounded-xl" />
					</div>
				</div>
			</div>
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
	);
}

function CTAButton({ children, variant }: { children?: React.ReactNode; variant?: "default" | "secondary" }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={cn("md:w-56",variant !== "secondary"?"text-white":"")} size={"lg"} variant={variant === "secondary" ? "secondary" : "default"}>
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
