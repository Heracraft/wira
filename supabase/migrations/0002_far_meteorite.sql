ALTER TABLE "companyProfiles" ADD COLUMN "avatarUrl" varchar(255);--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "avatarUrl" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatarUrl";