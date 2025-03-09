import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import Rating from "@/components/rating";

const testimonials = [
	{
		name: "Emily R",
		text: "Wira helped me land my dream job!. I was able to connect with top companies and get multiple job offers. I highly recommend Wira to anyone looking for a job.",
		title: "Software Engineer",
		image: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
		rating: 5,
	},
	{
		name: "Michael T",
		text: "Wira is the best platform for finding top talent. I was able to connect with top professionals and hire the best candidates for my company.",
		title: "CEO",
		image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
		rating: 5,
	},
	{
		name: "Jessica L",
		text: "Wira is phenomenal! It made reaching top professionals easy and efficient",
		title: "Product Manager",
		image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
		rating: 5,
	},
	{
		name: "Sophia L",
		text: "I tried Wira as a test but I was amazed by the results. Connecting with top professionals was easy and efficient.",
		title: "Designer",
		image: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
		rating: 5,
	},
];


export default function Home() {
	return (
		<div className="flex flex-col gap-24 p-5 md:px-20 xl:px-36">
			<div className="flex flex-col items-center justify-center space-y-10 mt-14 md:px-20">
				<h2 className="text-3xl md:text-5xl font-semibold">Connect with Talent</h2>
				<p className="text-muted-foreground text-center">Discover and match with top professionals globally</p>
				<div className="flex gap-5 flex-wrap justify-center">
					<Button className="text-white" size={"lg"}>
						Join us now
					</Button>
					<Button variant={"outline"} size={"lg"} className="text-primary border-primary">
						Request demo
					</Button>
				</div>
				<img src="/media/hr.jpg" alt="Hiring" className="rounded-xl" />
			</div>
			<div className="flex flex-col items-center justify-center gap-14 mt-14">
				<div className="flex flex-col items-center gap-5">
					<h2 className="text-2xl md:text-5xl font-semibold">App Highlights</h2>
					<p className="text-muted-foreground">Discover top talent and career opportunities with ease, tailored to your preferences.</p>
				</div>
				<div className="flex flex-col sm:flex-row items-center flex-wrap">
					<div className="flex-1 flex flex-col gap-5">
						<h2 className="text-lg md:text-4xl font-semibold">Start Matching</h2>
						<p className="max-w-sm">Our Al-driven algorithm connects you with the best candidates or jobs based on your unique profile.</p>
						<div className="flex gap-5">
							<Button className="text-white">Try now</Button>
							<Button variant={"ghost"} className="text-primary border-primary">
								Learn more
							</Button>
						</div>
					</div>
					<div className="flex-1 sm:mt-0 mt-4">
						<img src="/media/hr.jpg" alt="Hiring" className="rounded-xl" />
					</div>
				</div>
				<div className="flex items-center flex-wrap flex-col sm:flex-row-reverse">
					<div className="flex-1 flex justify-end">
						<div className="flex flex-col gap-5">
							<h2 className="text-lg md:text-4xl font-semibold">Career Insights</h2>
							<p className="max-w-sm">Gain valuable career insights and industry trends to make informed decisions.</p>
							<div className="flex gap-5">
								<Button className="text-white">Try now</Button>
								<Button variant={"ghost"} className="text-primary border-primary">
									Learn more
								</Button>
							</div>
						</div>
					</div>
					<div className="flex-1 sm:mt-0 mt-4">
						<img src="/media/hr.jpg" alt="Hiring" className="rounded-xl max-w-[80%]/" />
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center gap-5 mt-24">
				<h2 className="text-3xl md:text-4xl font-semibold text-center">Hear from our awsome users!</h2>
				{/* <p className="text-muted-foreground">Discover top talent and career opportunities with ease, tailored to your preferences.</p> */}
				<div className="flex/ gap-5">
					<Carousel opts={{ loop: true }} className="max-w-xs md:max-w-none">
						<CarouselContent>
							{testimonials.map((testimonial) => (
								<CarouselItem key={testimonial.name} className="!max-w-full basis-auto sm:basis-1/2 md:basis-1/3">
									<div className="!max-w-full flex flex-col gap-5 border bg-neutral-50 rounded-lg p-5 h-full">
										<div className="flex items-center gap-5">
											<img src={testimonial.image} alt={testimonial.name} className="rounded-full aspect-square h-10" />
											<div className="flex flex-col">
												{/* <div className="flex gap-2 items-center"> */}
												<h3 className="text-lg font-semibold">{testimonial.name}</h3>
												{/* </div> */}
												<Rating rating={testimonial.rating} />
												{/* <p className="text-muted-foreground text-sm">{testimonial.title}</p> */}
											</div>
										</div>
										<p className="line-clamp-3">{testimonial.text}</p>
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
			</div>
		</div>
	);
}
