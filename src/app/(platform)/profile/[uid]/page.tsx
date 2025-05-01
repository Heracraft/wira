import { redirect } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/db";

import { format, parse } from "date-fns";

import ProfilePicture from "@/components/ProfilePicture";
import AddToWaitlistRSCwrapper from "./addToWaitlistRSCwrapper";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Briefcase, Mail, MapPin, Calendar, Phone, FileText } from "lucide-react";

import { createKv, stripeAdmin as stripe, createClient } from "@/lib/store.server";

import { isDev } from "@/lib/utils.server";
import { talentEvaluationProfiles } from "@/lib/shared";

import { AssessmentResult, FullTalentProfile } from "@/types";

async function incrementEngagementCount(uid: string) {
	const kv = createKv();
	const currentMonth = new Date().getMonth() + "-" + new Date().getFullYear();
	const profilesViewedCountKey = `${isDev ? "test-" : ""}profile-views:${uid}:${currentMonth}`;

	kv.incr(profilesViewedCountKey);

	// You might be thinking, why are we simply incrementing the count?
	// Do we know if the user has reached their plan's limit?
	// Wouldn't it be better to check the plan and then increment?
	// Well, the answer is that we don't need to check the plan here.

	// Middleware baby!.
	// The middleware will check the plan and redirect the user if they have reached their limit.
	// So we can just increment the count here and let the middleware handle the rest.

	// Middleware: access control, this RSC page: increment count (this function)

	// But hey, what if the user is on a trial?
	// Well, the middleware will check if the user is on a trial and allow them to view the profile.
	// We will still increment the count though, because we need to keep track of how many profiles the user has viewed.
	// When the trial ends, it will be a new month and the count will reset. 🤞

	// Now that I think about it, there might be an edge case for this
	// Even with a "30-day trial", someone signing up on February 1st in a non-leap year would see their trial end on March 3rd, 
	// but if they sign up on January 1st, it would end on January 31st (same month).
	// Immediate cancellations: If a user cancels their trial shortly after starting it, 
	// the trial may end in the same month it began.
	// I leave this to you to figure out. 😅
}

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
	// TODO: Increment engagement count
	const { uid } = await params;

	const client = await createClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) {
		redirect("/errors/401");
	}

	await incrementEngagementCount(user.id);

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

	// console.log(profile);

	return (
		<div className="flex flex-col gap-10 bg-background p-5 pt-20 md:px-20 xl:px-36">
			<div className="text-xl font-semibold">Personal Information</div>
			<div className="flex flex-wrap gap-10">
				<ProfilePicture className="size-28" fullName={profile.fullName} avatarUrl={profile.avatarUrl} />
				<div className="flex flex-col gap-3">
					<h3 className="text-lg font-semibold">{profile.fullName}</h3>
					<p className="text-muted-foreground">Member since {format(new Date(profile.createdAt), "do MMM, yyyy")}</p>
					{/* <span className="flex items-center gap-2">
							<p className="text-muted-foreground">Email:</p>
							<p>{profile.email}</p>
						</span> */}
					{/* <div className="grid gap-3 text-muted-foreground sm:grid-cols-2 sm:gap-x-20 md:gap-x-32">
						<p>Email: {profile.email}</p>
						<p>Phone: {profile.phoneNumber}</p>
						<p>
							Work preference - <span className="capitalize">{profile.workTypePreference}</span>
						</p>
						<p>
							Location: {profile.region}, {profile.country}
						</p>
						<p>Joined: {format(new Date(profile.createdAt), "do MMM, yyyy")}</p>
					</div> */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-20">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Mail className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Email</p>
								<p className="max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap font-medium sm:max-w-none">{profile.email}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Phone className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Phone</p>
								<p className="font-medium">{profile.phoneNumber}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Briefcase className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Work Preference</p>
								<p className="font-medium">{profile.workTypePreference}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<MapPin className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Location</p>
								<p className="font-medium">
									{profile.region}, {profile.country}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Calendar className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Joined</p>
								<p className="font-medium">{profile.createdAt}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<FileText className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Resume</p>
								<a href={profile.resume} target="_blank" className="text-primary underline-offset-2 hover:underline">
									View resume
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="grid gap-5">
				<h3 className="text-xl font-semibold">Bio</h3>
				<p className="text-muted-foreground">{profile.bio}</p>
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
				<h3 className="text-xl font-semibold">Questions Section</h3>
				<div className="grid gap-2">
					<div className="flex flex-col gap-2">
						<h6 className="text-md font-medium">What makes you a high-potential candidate?</h6>
						<p className="text-muted-foreground">{profile.highPotentialAnswer}</p>
					</div>
					<div className="flex flex-col gap-2">
						<h6 className="text-md font-medium">Describe a challenge you faced in an academic or professional setting and how you overcame it.</h6>
						<p className="text-muted-foreground">{profile.challengeAnswer}</p>
					</div>
				</div>
			</div>
			<div>
				<TalentEvaluationResults score={profile.assessmentScore} />
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
				<Suspense fallback={<Skeleton className="h-10 w-40" />}>
					<AddToWaitlistRSCwrapper employerUid={user.id} talentId={profile.profileId} />
				</Suspense>
			</div>
		</div>
	);
}

function TalentEvaluationResults({ score }: { score: number }) {
	const calculateResultFromScore = (score: number): AssessmentResult => {
		const profile = talentEvaluationProfiles.find((profile) => score >= profile.minScore && score <= profile.maxScore) || talentEvaluationProfiles[talentEvaluationProfiles.length - 1]; // Default to the last profile if none matches
		return {
			score,
			profile,
		};
	};

	const result = calculateResultFromScore(score);

	return (
		<main className="w-full max-w-3xl rounded-lg">
			<div className="mb-8">
				<span className="mb-2 text-xl font-bold text-neutral-900">Assessment Results</span>
				<p className="text-sm text-neutral-600">Based on talent's responses here is their talent evaluation profile:</p>
			</div>

			<div className="mb-8 rounded-lg bg-primary-50 p-6">
				<div className="mb-4 flex items-center">
					<span className="mr-4 text-4xl">{result.profile.icon}</span>
					<div>
						<h2 className="text-2xl font-bold text-primary-800">{result.profile.title}</h2>
						<p className="text-neutral-500">Score: {result.score} points</p>
					</div>
				</div>

				<p className="mb-4 text-neutral-700">{result.profile.description}</p>

				<div>
					<h3 className="mb-2 font-semibold text-primary-700">Best Career Fits:</h3>
					<div className="flex flex-wrap gap-2">
						{result.profile.bestFit.map((career, index) => (
							<span key={index} className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800">
								{career}
							</span>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
