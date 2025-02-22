import { pgTable, serial, varchar, text, date, integer, boolean, unique, primaryKey } from "drizzle-orm/pg-core";

// Users (Talent or Employers)
export const users = pgTable("users", {
	user_id: serial("user_id").primaryKey(),
	user_type: varchar("user_type", { enum: ["talent", "employer"] }).notNull(),
	first_name: varchar("first_name", { length: 255 }),
	last_name: varchar("last_name", { length: 255 }),
	email: varchar("email", { length: 255 }).unique().notNull(),
	location: varchar("location", { length: 255 }),
	created_at: date("created_at").defaultNow(),
});

export type InsertUser = typeof users.$inferInsert;

// Talent Profiles
export const talent_profiles = pgTable("talent_profiles", {
	profile_id: serial("profile_id").primaryKey(),
	user_id: integer("user_id")
		.references(() => users.user_id)
		.unique()
		.notNull(),
	location: varchar("location", { length: 255 }),
	education: text("education"),
	work_experience: text("work_experience"),
	skills: varchar("skill", { length: 255 }).array(), // Array of strings for skills
	personality_type: varchar("personality_type", { length: 255 }),
	personality_description: text("personality_description"),
	questions_section: text("questions_section"),
});

// Education Entries
export const education_entries = pgTable("education_entries", {
	education_id: serial("education_id").primaryKey(),
	profile_id: integer("profile_id")
		.references(() => talent_profiles.profile_id)
		.notNull(),
	institution: varchar("institution", { length: 255 }),
	degree: varchar("degree", { length: 255 }),
	start_date: date("start_date"),
	end_date: date("end_date"),
});

// Work Experience Entries
export const work_experience_entries = pgTable("work_experience_entries", {
	experience_id: serial("experience_id").primaryKey(),
	profile_id: integer("profile_id")
		.references(() => talent_profiles.profile_id)
		.notNull(),
	company: varchar("company", { length: 255 }),
	position: varchar("position", { length: 255 }),
	start_date: date("start_date"),
	end_date: date("end_date"),
	description: text("description"),
});

// Skills
export const skills = pgTable("skills", {
	skill_id: serial("skill_id").primaryKey(),
	skill_name: varchar("skill_name", { length: 255 }).unique().notNull(),
});

// Linking Table for Talent Profiles and Skills (Many-to-Many)
export const talent_skills = pgTable(
	"talent_skills",
	{
		talent_id: integer("talent_id")
			.references(() => talent_profiles.profile_id)
			.notNull(),
		skill_id: integer("skill_id")
			.references(() => skills.skill_id)
			.notNull(),
		experience_level: varchar("experience_level", { length: 255 }),
	},
	(table) => [
		primaryKey({ columns: [table.talent_id, table.skill_id] }),
		// Composite key to prevent duplicates
	]
);

// ... (Other tables like job_postings, matches, career_insights, testimonials, etc. -  You can translate those similarly)
