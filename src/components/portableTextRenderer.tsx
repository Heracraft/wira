import Link from "next/link";

import { PortableText } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/store.server";

import { Button } from "@/components/ui/button";
import { Card, CardContent as UICardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { TypedObject } from "@portabletext/types";

import { cn } from "@/lib/utils";

const builder = imageUrlBuilder(sanityClient);

type Card = {
	layout: string;
	subtitle?: string;
	image: {
		_type: string;
		asset: object;
	};
	_type: string;
	actionButtons: {
		label: string;
		url: string;
		variant: "default" | "secondary" | "outline" | "ghost";
		type: "external" | "internal";
	}[];
	_key: string;
	title: string;
	content: TypedObject[];
	direction: "left" | "right";
};

export default function MultimediaPortableTextRenderer({ body }: { body: TypedObject[] }) {
	return (
		<PortableText
			components={{
				types: {
					image: RenderImage,
					card: RenderCard,
					youtube: RenderYoutubeEmbedd,
					button: RenderButton,
				},
				marks: {
					center: ({ children }: any) => <span className="block w-full text-center text-inherit">{children}</span>,
					muted: ({ children }: any) => <span className="text-muted-foreground">{children}</span>,
				},
			}}
			value={body}
		/>
	);
}
function RenderImage({
	value,
}: {
	value: {
		_type: string;
		asset: object;
	};
}) {
	const url = builder.image(value.asset).url() || "";
	return <img className="mt-5 max-w-full" src={url} alt="embedded image" />;
}

function RenderCard({ value }: { value: Card }) {
	let imageUrl = builder.image(value.image.asset).url() || "";
	if (value.layout === "horizontal") {
		if (value.direction === "right") {
			return (
				// the .portableTextCard class is to allow custom styling for the card.
				<div className="flex flex-col flex-wrap items-center sm:flex-row-reverse">
					<div className="mt-4 flex-1 sm:mt-0">
						<img src={imageUrl} alt="Hiring" className="max-w-[80%]/ rounded-xl" />
					</div>
					<CardContent value={value} className="min-w-52 md:w-1/2" />
				</div>
			);
		} else {
			return (
				<div className="mt-14 flex flex-col flex-wrap items-center sm:flex-row-reverse">
					<CardContent value={value} className="min-w-52 md:w-1/2 justify-end" />
					<div className="mt-4 flex-1 sm:mt-0">
						<img src={imageUrl} alt="Hiring" className="max-w-[80%]/ rounded-xl" />
					</div>
				</div>
			);
		}
	} else {
		// vertical layout. 
		// Completely untested. Just put it in there for future use. 
		return (
			<Card>
				<UICardContent>
					<CardContent value={value} />
				</UICardContent>
			</Card>
		);
	}
}

function CardContent({ value, className }: { value: Card; className?: string }) {
	return (
		<div className={cn("flex flex-1 prose-headings:!m-0 prose-p:m-0", className)}>
			<div className="flex flex-col gap-5">
				<h3 className="font-semibold">{value.title}</h3>
				<div className="line-clamp-6 max-w-sm">
					<PortableText value={value.content} />
				</div>
				{value.actionButtons && (
					<div className="flex gap-5">
						{value.actionButtons.map((button) => (
							<Link href={button.url} target={button.type == "external" ? "_blank" : "_self"} key={button.label}>
								<Button variant={button.variant} size={"lg"} className="">
									{button.label}
								</Button>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// A youtube renderer, if you ever need it.
function RenderYoutubeEmbedd({ value }: { value: { url: string; width?: string } }) {
	const generateYoutubeEmbed = (url: string) => {
		try {
			let getId = (url: string) => {
				const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
				const match = url.match(regExp);

				return match && match[2].length === 11 ? match[2] : null;
			};

			const videoId = getId(url);
			const iframeMarkup = '<iframe src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
			return iframeMarkup;
		} catch (error) {
			return null;
		}
	};
	const iframe = generateYoutubeEmbed(value.url);
	if (iframe) {
		let width = "100%";
		let widthUtilityCalss = "[&>iframe]:w-full";

		if (value.width) {
			width = value.width;
		}

		if (width == "75%") {
			widthUtilityCalss = "md:[&>iframe]:w-3/4";
		}
		if (width == "50%") {
			widthUtilityCalss = "md:[&>iframe]:w-1/2";
		}

		return <div className={`[&>iframe]:aspect-video ${widthUtilityCalss} mb-5 flex justify-center`} dangerouslySetInnerHTML={{ __html: iframe }} />;
	} else {
		return <p className="w-full rounded border p-10">Error occurred: Unable to embedd video. Try again later</p>;
	}
}

function RenderButton({
	value,
}: {
	value: {
		url: string;
		_type: "button";
		label: string;
		_key: string;
		type?: "external" | "internal";
		variant: "default" | "secondary" | "outline" | "ghost";
	};
}) {
	return (
		<Link href={value.url} target={value.type != "internal" ? "_blank" : "_self"} className="border-none">
			<Button variant={value.variant}>{value.label}</Button>
		</Link>
	);
}
