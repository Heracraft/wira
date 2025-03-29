import { pgTable, serial, varchar, text, date, integer, boolean, unique, primaryKey, jsonb } from "drizzle-orm/pg-core";

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
	dateOfBirth: date("dateOfBirth"),
	avatarUrl: varchar("avatarUrl", { length: 255 }),

	// location,
	country: varchar("country", { length: 255 }),
	region: varchar("region", { length: 255 }),
	postalCode: varchar("postalCode", { length: 255 }),

	linkedInProfile: varchar("linkedInProfile", { length: 255 }),

	skills: varchar("skill", { length: 255 }).array(), // There could be a separate table for skills

	industryInterests: varchar("industryInterests", { length: 255 }).array(),
	preferredCompanyTypes: varchar("preferredCompanyTypes", { length: 255 }).array(),
	workTypePreference: varchar("workTypePreference", { enum: ["full-time", "part-time", "both"] }),

	resume: varchar("resume", { length: 255 }),

	profileCompletionStatus: jsonb("profileCompletionStatus").default({
		personalInfo: false,
		educationExperience: false,
		preferences: false,
		overallComplete:true
	}).notNull(),
	

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
	avatarUrl: varchar("avatarUrl", { length: 255 }),
});

export type InsertCompanyProfile = typeof companyProfiles.$inferInsert;

// Education Entries
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
	endDate: varchar("endDate",{ length: 25 }),
});

export type EducationEntry = typeof educationEntries.$inferSelect;

// Work Experience Entries
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

// Skills - **dropped: unnecessary for now**
// export const skills = pgTable("skills", {
// 	skillId: serial("skillId").primaryKey(),
// 	skillName: varchar("skillName", { length: 255 }).unique().notNull(),
// });

// **dropped: unnecessary for now**: Linking Table for Talent Profiles and Skills (Many-to-Many)
// export const talentSkills = pgTable(
// 	"talentSkills",
// 	{
// 		talentId: integer("talentId")
// 			.references(() => talentProfiles.profileId)
// 			.notNull(),
// 		skillId: integer("skillId")
// 			.references(() => skills.skillId)
// 			.notNull(),
// 		experienceLevel: varchar("experienceLevel", { length: 255 }),
// 	},
// 	(table) => [
// 		primaryKey({ columns: [table.talentId, table.skillId] }),
// 		// Composite key to prevent duplicates
// 	]
// );

// ... (Other tables like jobPostings, matches, careerInsights, testimonials, etc. -  You can translate those similarly)
