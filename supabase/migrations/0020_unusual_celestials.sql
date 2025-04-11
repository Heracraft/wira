ALTER TABLE "talentProfiles" ALTER COLUMN "profileCompletionStatus" SET DEFAULT '{"personalInfo":false,"educationExperience":false,"preferences":false,"assessment":false,"spotlight":false,"overallComplete":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "highPotentialAnswer" text;--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "challengeAnswer" text;