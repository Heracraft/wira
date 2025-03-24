DROP TABLE "skills" CASCADE;--> statement-breakpoint
DROP TABLE "talentSkills" CASCADE;--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD COLUMN "skill" varchar(255)[];