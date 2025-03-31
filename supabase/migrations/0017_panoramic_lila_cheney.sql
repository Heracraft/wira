ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_employerId_companyProfiles_profileId_fk";
--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "employerId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_employerId_companyProfiles_userId_fk" FOREIGN KEY ("employerId") REFERENCES "public"."companyProfiles"("userId") ON DELETE no action ON UPDATE no action;