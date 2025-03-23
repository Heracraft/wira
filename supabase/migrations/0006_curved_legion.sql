ALTER TABLE "educationEntries" ALTER COLUMN "startDate" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "educationEntries" ALTER COLUMN "endDate" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "talentProfiles" DROP COLUMN "location";