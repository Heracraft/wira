"use client";

// import { useEffect } from "react";

// import { toast } from "sonner";

import { TalentProfileContext } from "./context";

import type { TalentProfile, ProfileCompletion } from "@/types";

export default function TalentProfileProvider({ profile, children }: { profile: TalentProfile; children: React.ReactNode }) {
	// useEffect(() => {
	// 	if (!profile) {
	// 		console.log("Error fetching profile");
	// 	}
	// 	const profileCompletionStatus = profile.profileCompletionStatus as ProfileCompletion;
	// 	if (profileCompletionStatus.overallComplete === false) {
	// 		const completeProfileReminderSent = JSON.parse(sessionStorage.getItem("completeProfileReminderSent") || "false");
	// 		if (!completeProfileReminderSent) {
	// 			sessionStorage.setItem("completeProfileReminderSent", "true");
	// 			setTimeout(() => {
	// 				toast.info("Profile is incomplete", {
	// 					description: "You are not visible to employers until your profile is complete",
	// 				});
	// 			}, 1000);
	// 		}
	// 	}
	// }, []);
	return <TalentProfileContext.Provider value={profile}>{children}</TalentProfileContext.Provider>;
}
