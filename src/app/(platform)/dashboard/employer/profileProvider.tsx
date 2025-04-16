"use client";

import { CompanyProfileContext } from "./context";

import type { CompanyProfileRow } from "@/db/schema";

export default function CompanyProfileProvider({ profile, children }: { profile: CompanyProfileRow; children: React.ReactNode }) {
	return <CompanyProfileContext.Provider value={profile}>{children}</CompanyProfileContext.Provider>;
}
