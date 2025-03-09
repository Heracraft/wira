import { Button } from "@/components/ui/button";

import PersonalityTraitsChart from "./PersonalityTraits";

const chartData = [
	{ trait: "Openness", value: 0.8, fill: "var(--color-Openness)" },
	{ trait: "Conscientiousness", value: 0.7, fill: "var(--color-Conscientiousness)" },
	{ trait: "Extraversion", value: 0.6, fill: "var(--color-Extraversion)" },
	{ trait: "Agreeableness", value: 0.5, fill: "var(--color-Agreeableness)" },
	{ trait: "Neuroticism", value: 0.4, fill: "var(--color-Neuroticism)" },
];

export default function Page() {
	return (
		<div className="flex flex-col p-5 pt-20 md:px-20 xl:px-36 bg-background gap-10">
			<div className="text-xl font-semibold">User Information</div>
			<div className="flex flex-wrap gap-10">
				<img src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" className="rounded-full aspect-square h-28" />
				<div className="flex flex-col gap-3">
					<h3 className="text-lg font-semibold">John Doe</h3>
					<div className="grid gap-3 sm:grid-cols-2 sm:gap-x-20 md:gap-x-32 text-muted-foreground">
						<p>Email: john.doe@example.com</p>
						<p>Phone: +1234567890</p>
						<p>Remote - Mid Level</p>
						<p>Location: New York, USA</p>
						<p>Joined: January 1, 2023</p>
						<p>Last Active: October 1, 2023</p>
					</div>
				</div>
				<div className="flex-1 flex justify-end">
					<Button size={"lg"}>Engage</Button>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Education</h3>
				<div className="flex gap-5 flex-wrap">
					{[
						{
							degree: "Bachelor of Science in Computer Science",
							institution: "University of Example",
							year: "2018 - 2022",
						},
						{
							degree: "Master of Science in Software Engineering",
							institution: "University of Example",
							year: "2022 - 2024",
						},
					].map((education, index) => (
						<div key={index} className="border p-4 rounded-lg flex-1 max-w-sm">
							<h4 className="font-medium">{education.degree}</h4>
							<p className="text-muted-foreground">{education.institution}</p>
							<p className="text-muted-foreground">{education.year}</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Work Experience</h3>
				<div className="flex gap-5 flex-wrap">
					{[
						{
							role: "Software Engineer",
							company: "Tech Corp",
							duration: "2022 - Present",
						},
						{
							role: "Intern",
							company: "Startup Inc.",
							duration: "2021 - 2022",
						},
					].map((experience, index) => (
						<div key={index} className="border p-4 rounded-lg flex-1 max-w-sm">
							<h4 className="font-medium">{experience.role}</h4>
							<p className="text-muted-foreground">{experience.company}</p>
							<p className="text-muted-foreground">{experience.duration}</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Skills</h3>
				<div className="flex gap-2 flex-wrap">
					{["JavaScript", "React", "Node.js", "Python", "Django"].map((skill, index) => (
						<span key={index} className="shrink-0 px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs">
							{skill}
						</span>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<PersonalityTraitsChart chartData={chartData} />
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Questions Section</h3>
				<div>
					<h6>Challenge overcome</h6>
					<p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>
                <div>
					<h6>Best trait</h6>
					<p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>
			</div>
            <div className="flex-1 flex">
					<Button size={"lg"}>Engage</Button>
				</div>
		</div>
	);
}
