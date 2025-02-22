import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center space-y-10 mt-14">
			<h2 className="text-5xl font-semibold">Connect with Talent</h2>
			<p>Discover and match with top professionals globally</p>
			<div className="flex gap-5">
				<Button className="text-white" size={"lg"}>
					Join us now
				</Button>
				<Button variant={"outline"} size={"lg"} className="text-primary border-primary">
					Request demo
				</Button>
			</div>
			<img src="/media/hr.jpg" alt="Hiring" className="rounded-xl max-w-[70%]" />
		</div>
	);
}
