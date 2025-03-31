import { sql, eq } from "drizzle-orm";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import type { TalentProfileRow, EducationEntry, WorkExperienceEntry } from "@/db/schema";

import { format, parse } from "date-fns";

import ProfilePicture from "@/components/ProfilePicture";
import PersonalityTraitsChart from "./PersonalityTraits";
import AddToWaitlist from "./addToWaitlist";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type FullTalentProfile = {
	profileId: number;
	userId: string;
	email: string;
	createdAt: string;
	fullName: string;
	phoneNumber: string;
	dateOfBirth: string;
	avatarUrl: string;
	country: string;
	region: string;
	linkedInProfile: string;
	postalCode: string;
	skills: string[];
	industryInterests: string[];
	preferredCompanyTypes: string[];
	workTypePreference: "full-time" | "part-time" | "both";
	resume: string;
	profileCompletionStatus: {
		preferences: boolean;
		personalInfo: boolean;
		overallComplete: boolean;
		educationExperience: boolean;
	};
	searchVector: string;
	educationentries: EducationEntry[];
	workexperienceentries: WorkExperienceEntry[];
};

const chartData = [
	{ trait: "Openness", value: 0.8, fill: "var(--color-Openness)" },
	{ trait: "Conscientiousness", value: 0.7, fill: "var(--color-Conscientiousness)" },
	{ trait: "Extraversion", value: 0.6, fill: "var(--color-Extraversion)" },
	{ trait: "Agreeableness", value: 0.5, fill: "var(--color-Agreeableness)" },
	{ trait: "Neuroticism", value: 0.4, fill: "var(--color-Neuroticism)" },
];

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
	// TODO: Increment engagement count
	const { uid } = await params;

	const profile = (
		await db.execute(
			`SELECT 
    u."email",
    u."createdAt",
    tp.*,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'educationId', ee."educationId",
                'institution', ee."institution",
                'degree', ee."degree",
                'major', ee."major",
                'gpa', ee."gpa",
                'startDate', ee."startDate",
                'endDate', ee."endDate"
            )
        ) FILTER (WHERE ee."educationId" IS NOT NULL), '[]'
    ) AS educationEntries,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'experienceId', we."experienceId",
                'company', we."company",
                'position', we."position",
                'startDate', we."startDate",
                'endDate', we."endDate",
                'description', we."description"
            )
        ) FILTER (WHERE we."experienceId" IS NOT NULL), '[]'
    ) AS workExperienceEntries
FROM "users" u
INNER JOIN "talentProfiles" tp ON u."userId" = tp."userId"
LEFT JOIN "educationEntries" ee ON tp."profileId" = ee."profileId"
LEFT JOIN "workExperienceEntries" we ON tp."profileId" = we."profileId"
WHERE u."userId" = '${uid}'
GROUP BY u."userId", tp."profileId";`,
		)
	)[0] as FullTalentProfile;

	// TODO: check if the user is already on the waitlist
	// const isOnWaitlist = await db.select().from(waitlist).where(eq(waitlist.talentId, uid)).limit(1);

	return (
		<div className="flex flex-col gap-10 bg-background p-5 pt-20 md:px-20 xl:px-36">
			<div className="text-xl font-semibold">Personal Information</div>
			<div className="flex flex-wrap gap-10">
				<ProfilePicture className="size-28" fullName={profile.fullName} avatarUrl={profile.avatarUrl} />
				<div className="flex flex-col gap-3">
					<h3 className="text-lg font-semibold">{profile.fullName}</h3>
					<div className="grid gap-3 text-muted-foreground sm:grid-cols-2 sm:gap-x-20 md:gap-x-32">
						<p>Email: {profile.email}</p>
						<p>Phone: {profile.phoneNumber}</p>
						<p>
							Work preference - <span className="capitalize">{profile.workTypePreference}</span>
						</p>
						<p>
							Location: {profile.region}, {profile.country}
						</p>
						<p>Joined: {format(new Date(profile.createdAt), "do MMM, yyyy")}</p>
						{/* <p>Age: {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years</p> */}
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Education</h3>
				<div className="flex flex-wrap gap-5">
					{/* EXPANDED view? */}
					{profile.educationentries.map((education, index) => (
						<div key={index} className="w-full max-w-md flex-1 rounded-lg border p-4 sm:min-w-80 sm:shrink-0">
							<div className="flex w-full items-center justify-between">
								<h4 className="text-md max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{`${education.degree} in ${education.major}`}</h4>
								{education.gpa && <Badge className="text-xs text-white sm:text-sm">{education.gpa} gpa</Badge>}
							</div>
							<div className="flex items-center gap-2">
								<p className="text-muted-foreground">{education.institution}</p>
							</div>
							<div className="flex gap-2">
								<p className="text-muted-foreground">{education.startDate}</p>
								<p className="text-muted-foreground">-</p>
								<p className="text-muted-foreground">{education.endDate}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Work Experience</h3>
				<div className="flex flex-wrap gap-5">
					{profile.workexperienceentries.map((experience, index) => (
						<div key={index} className="w-full max-w-md rounded-lg border p-4 sm:min-w-80 sm:shrink-0">
							<h4 className="text-md font-semibold">{experience.position}</h4>
							<p className="">{experience.company}</p>
							<div className="flex gap-2">
								<p className="">{format(parse(experience.startDate as string, "yyyy-MM-dd", new Date()), "MMMM, yyyy")}</p>
								<p className="">-</p>
								<p className="">{format(parse(experience.endDate as string, "yyyy-MM-dd", new Date()), "MMMM, yyyy")}</p>
							</div>
							<p className="line-clamp-3 text-muted-foreground">{experience.description}</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Skills</h3>
				<div className="flex flex-wrap gap-2">
					{profile.skills.map((skill, index) => (
						<span key={index} className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800">
							{skill}
						</span>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<PersonalityTraitsChart chartData={chartData} />
			</div>
			{/* <div className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold">Questions Section</h3>
				<div>
					<h6>Challenge overcome</h6>
					<p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>
				<div>
					<h6>Best trait</h6>
					<p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>
			</div> */}
			<div className="flex flex-1">
				<AddToWaitlist talentId={profile.profileId} />
			</div>
		</div>
	);
}
