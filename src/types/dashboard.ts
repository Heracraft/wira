import type { TalentProfileRow, WorkExperienceEntry, EducationEntry } from "@/db/schema";

export type TalentProfile = TalentProfileRow & { workExperience: WorkExperienceEntry[] } & { education: EducationEntry[] };