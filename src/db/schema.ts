import { customType, pgTable, serial, varchar, text, date, integer, jsonb } from "drizzle-orm/pg-core";

// const tsvector = customType<{ data: string }>({
// 	dataType() {
// 		return `tsvector`;
// 	},
// });

export const tsvector = customType<{
	data: string;
}>({
	dataType() {
		return `tsvector`;
	},
});

// Users (Talent or Employers)
export const users = pgTable("users", {
	userId: varchar("userId", { length: 255 }).primaryKey(),
	userType: varchar("userType", { enum: ["talent", "employer"] }).notNull(),
	email: varchar("email", { length: 255 }).unique().notNull(),
	createdAt: date("createdAt").defaultNow(),
});

export type InsertUser = typeof users.$inferInsert;

// Talent Profiles
export const talentProfiles = pgTable("talentProfiles", {
	profileId: serial("profileId").primaryKey(),
	userId: varchar("userId", { length: 255 })
		.references(() => users.userId)
		.unique()
		.notNull(),
	fullName: varchar("fullName", { length: 255 }),
	phoneNumber: varchar("phoneNumber", { length: 255 }),

	// in case you are wondering why this is not a date type,
	// The answer is............... TIMEZONES!!!!!.
	// fuck timezones.
	dateOfBirth: varchar("dateOfBirth", { length: 255 }),
	avatarUrl: varchar("avatarUrl", { length: 255 }),

	country: varchar("country", { length: 255 }),
	region: varchar("region", { length: 255 }),
	postalCode: varchar("postalCode", { length: 255 }),

	linkedInProfile: varchar("linkedInProfile", { length: 255 }),

	skills: varchar("skills", { length: 255 }).array(), // There could be a separate table for skills

	industryInterests: varchar("industryInterests", { length: 255 }).array(),
	preferredCompanyTypes: varchar("preferredCompanyTypes", { length: 255 }).array(),
	workTypePreference: varchar("workTypePreference", { enum: ["full-time", "part-time", "both"] }),

	resume: varchar("resume", { length: 255 }),

	assessmentScore: integer("assessmentScore"),

	profileCompletionStatus: jsonb("profileCompletionStatus")
		.default({
			personalInfo: false,
			educationExperience: false,
			preferences: false,
			assessment: false,
			overallComplete: false,
		})
		.notNull(),
	searchVector: tsvector("searchVector"), // not natively supported in drizzle-orm. Made a custom type for it

	// personalityType: varchar("personalityType", { length: 255 }),
	// personalityDescription: text("personalityDescription"),
	// questionsSection: text("questionsSection"),
});

export type TalentProfileRow = typeof talentProfiles.$inferSelect;

export const companyProfiles = pgTable("companyProfiles", {
	profileId: serial("profileId").primaryKey(),
	userId: varchar("userId")
		.references(() => users.userId)
		.unique()
		.notNull(),
	companyName: varchar("companyName", { length: 255 }).notNull(),
	contactPersonName: varchar("contactPersonName", { length: 255 }).notNull(),
	contactPersonPosition: varchar("contactPersonPosition", { length: 255 }).notNull(),
	companyWebsite: varchar("companyWebsite", { length: 255 }),
	industry: varchar("industry", { length: 255 }),
	country: varchar("country", { length: 255 }),
	region: varchar("region", { length: 255 }),
	postalCode: varchar("postalCode", { length: 255 }),
	avatarUrl: varchar("avatarUrl", { length: 255 }),
});

export type InsertCompanyProfile = typeof companyProfiles.$inferInsert;
export type CompanyProfileRow = typeof companyProfiles.$inferSelect;

export const educationEntries = pgTable("educationEntries", {
	educationId: serial("educationId").primaryKey(),
	profileId: integer("profileId")
		.references(() => talentProfiles.profileId)
		.notNull(),
	institution: varchar("institution", { length: 255 }),
	degree: varchar("degree", { length: 255 }),
	major: varchar("major", { length: 255 }),
	gpa: varchar("gpa", { length: 255 }),
	startDate: varchar("startDate", { length: 25 }),
	endDate: varchar("endDate", { length: 25 }),
});

export type EducationEntry = typeof educationEntries.$inferSelect;

export const workExperienceEntries = pgTable("workExperienceEntries", {
	experienceId: serial("experienceId").primaryKey(),
	profileId: integer("profileId")
		.references(() => talentProfiles.profileId)
		.notNull(),
	company: varchar("company", { length: 255 }),
	position: varchar("position", { length: 255 }),
	startDate: date("startDate"),
	endDate: date("endDate"),
	description: text("description"),
});

export type WorkExperienceEntry = typeof workExperienceEntries.$inferSelect;

export const waitlist = pgTable("waitlist", {
	waitlistId: serial("waitlistId").primaryKey(),
	employerId: varchar("employerId")
		.references(() => companyProfiles.userId)
		.notNull(),
	talentId: integer("talentId")
		.references(() => talentProfiles.profileId)
		.notNull(),
	addedAt: date("addedAt").defaultNow(),
	// Status of the waitlist entry
	// Useless for now, but could be used for automation, worflow management, giving feedback to users, etc.
	// status: varchar("status", { enum: ["pending", "engaged", "removed"] }).default("pending"),
});

export type WaitlistRow = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;

/*
-- PostgreSQL Full Text Search
-- To enable full text search, you need to create a tsvector column and a trigger to update it.
-- The tsvector column will be used to store the search vector for the talent profiles.
-- The trigger will automatically update the tsvector column whenever a row is inserted or updated.

-- Add into a random migration.
-- The trigger plus the index are defined in  this migration /supabase/migrations/0013_equal_maria_hill.sql
-- The code for creating the trigger and function is as follows:

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.searchVector := to_tsvector(
    'english',
    COALESCE(NEW.fullName, '') || ' ' ||
    COALESCE(array_to_string(NEW.skills, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.industryInterests, ' '), '') || ' ' ||
    COALESCE(NEW.country, '') || ' ' ||
    COALESCE(NEW.region, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON "talentProfiles"
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

--> Create an index on the search vector column for faster searching
CREATE INDEX idx_talent_profiles_search_vector
ON "talentProfiles"
USING GIN (searchVector); --> Another unsupported thing: index types

// example query
SELECT *
FROM "talentProfiles"
WHERE searchVector @@ to_tsquery('english', 'developer & javascript');

*/
