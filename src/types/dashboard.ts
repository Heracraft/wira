import type { TalentProfileRow, WorkExperienceEntry, EducationEntry } from "@/db/schema";

export type TalentProfile = TalentProfileRow & { workExperience: WorkExperienceEntry[] } & { education: EducationEntry[] };

export type ProfileCompletion = {
	personalInfo: boolean;
	educationExperience: boolean;
	preferences: boolean;
	overallComplete: boolean; // this is used to determine if the profile is complete
};
