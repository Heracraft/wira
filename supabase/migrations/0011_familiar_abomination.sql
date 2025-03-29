ALTER TABLE "talentProfiles" ALTER COLUMN "profileCompletionStatus" SET DEFAULT '{"personalInfo":false,"educationExperience":false,"preferences":false,"overallComplete":true}'::jsonb;--> statement-breakpoint
ALTER TABLE "educationEntries" ADD COLUMN "major" varchar(255);--> statement-breakpoint
ALTER TABLE "educationEntries" ADD COLUMN "gpa" varchar(255);