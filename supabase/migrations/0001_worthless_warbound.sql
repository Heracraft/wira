CREATE TABLE "companyProfiles" (
	"profileId" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"companyName" varchar(255) NOT NULL,
	"contactPersonName" varchar(255) NOT NULL,
	"contactPersonPosition" varchar(255) NOT NULL,
	"companyWebsite" varchar(255),
	"industry" varchar(255),
	CONSTRAINT "companyProfiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "educationEntries" (
	"educationId" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"institution" varchar(255),
	"degree" varchar(255),
	"startDate" date,
	"endDate" date
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"skillId" serial PRIMARY KEY NOT NULL,
	"skillName" varchar(255) NOT NULL,
	CONSTRAINT "skills_skillName_unique" UNIQUE("skillName")
);
--> statement-breakpoint
CREATE TABLE "talentProfiles" (
	"profileId" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"fullName" varchar(255),
	"location" varchar(255),
	"phoneNumber" varchar(255),
	"dateOfBirth" date,
	CONSTRAINT "talentProfiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "talentSkills" (
	"talentId" integer NOT NULL,
	"skillId" integer NOT NULL,
	"experienceLevel" varchar(255),
	CONSTRAINT "talentSkills_talentId_skillId_pk" PRIMARY KEY("talentId","skillId")
);
--> statement-breakpoint
CREATE TABLE "workExperienceEntries" (
	"experienceId" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"company" varchar(255),
	"position" varchar(255),
	"startDate" date,
	"endDate" date,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "userId";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "userId" TYPE varchar(255); --> Had to manually add this line because the generated migration did not pick up on the change in column type from integer to varchar
ALTER TABLE "users" ADD COLUMN "userType" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatarUrl" varchar(255);--> statement-breakpoint
ALTER TABLE "companyProfiles" ADD CONSTRAINT "companyProfiles_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "educationEntries" ADD CONSTRAINT "educationEntries_profileId_talentProfiles_profileId_fk" FOREIGN KEY ("profileId") REFERENCES "public"."talentProfiles"("profileId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talentProfiles" ADD CONSTRAINT "talentProfiles_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talentSkills" ADD CONSTRAINT "talentSkills_talentId_talentProfiles_profileId_fk" FOREIGN KEY ("talentId") REFERENCES "public"."talentProfiles"("profileId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talentSkills" ADD CONSTRAINT "talentSkills_skillId_skills_skillId_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("skillId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workExperienceEntries" ADD CONSTRAINT "workExperienceEntries_profileId_talentProfiles_profileId_fk" FOREIGN KEY ("profileId") REFERENCES "public"."talentProfiles"("profileId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");