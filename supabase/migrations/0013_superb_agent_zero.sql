CREATE TABLE "waitlist" (
	"waitlistId" serial PRIMARY KEY NOT NULL,
	"employerId" integer NOT NULL,
	"talentId" integer NOT NULL,
	"addedAt" date DEFAULT now(),
	"status" varchar DEFAULT 'pending'
);
--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "searchVector" tsvector;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_employerId_companyProfiles_profileId_fk" FOREIGN KEY ("employerId") REFERENCES "public"."companyProfiles"("profileId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_talentId_talentProfiles_profileId_fk" FOREIGN KEY ("talentId") REFERENCES "public"."talentProfiles"("profileId") ON DELETE no action ON UPDATE no action;
