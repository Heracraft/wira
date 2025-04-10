"use client";

import { TalentProfileContext } from "./context";

import type {TalentProfile} from "@/types"

export default function TalentProfileProvider({ profile, children }: { profile: TalentProfile; children: React.ReactNode }) {
	return <TalentProfileContext.Provider value={profile}>{children}</TalentProfileContext.Provider>;
}
