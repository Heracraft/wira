import Stripe from "stripe";
import type { TalentProfileRow, WorkExperienceEntry, EducationEntry } from "@/db/schema";

// --stripe
export interface Plan {
	planName: string;
	priceId: string;
	testPriceId: string;
	amount?: string;
	billingPeriod?: string;
	description: string;
	talentEngagementLimit?: number;
	features: {
		documentVerification?: boolean | undefined;
		onboardingAssistance?: boolean | undefined;
		legalSupport?: boolean | undefined;
	};
	actionButtonConfig: {
		href: string;
		variant: "outline" | "default" | "link" | "destructive" | "secondary" | "ghost";
		label: string;
	};
}

export type STRIPE_SUB_CACHE =
	| {
			subscriptionId: string | null;
			status: Stripe.Subscription.Status;
			priceId: string | null;
			currentPeriodStart: number | null;
			currentPeriodEnd: number | null;
			cancelAtPeriodEnd: boolean;
			paymentMethod: {
				brand: string | null; // e.g., "visa", "mastercard"
				last4: string | null; // e.g., "4242"
			} | null;
	  }
	| {
			status: "none";
	  };

// --auth
export type User = {
	id: string;
	email: string;
	userType: "talent" | "employer";
} | null;

//  --dashboard--
export type TalentProfile = TalentProfileRow & { workExperience: WorkExperienceEntry[] } & { education: EducationEntry[] };

export type ProfileCompletion = {
	assessment: boolean;
	personalInfo: boolean;
	educationExperience: boolean;
	preferences: boolean;
	spotlight: boolean;
	overallComplete: boolean; // this is used to determine if the profile is complete
};

// --dashboard/talent/assessment--
export interface Question {
	id: number;
	text: string;
	options: Option[];
}

export interface Option {
	label: string;
	value: string;
	points: number;
}

interface TalentEvaluationProfile {
	id: string;
	title: string;
	icon: string;
	description: string;
	minScore: number;
	maxScore: number;
	bestFit: string[];
}

export interface AssessmentResult {
	score: number;
	profile: TalentEvaluationProfile;
}

export type FullTalentProfile = {
	profileId: number;
	userId: string;
	email: string;
	createdAt: string;
	fullName: string;
	phoneNumber: string;
	dateOfBirth: string;
	avatarUrl: string;
	country: string;
	region: string;
	linkedInProfile: string;
	postalCode: string;
	skills: string[];
	industryInterests: string[];
	preferredCompanyTypes: string[];
	workTypePreference: "full-time" | "part-time" | "both";
	resume: string;
	profileCompletionStatus: {
		preferences: boolean;
		personalInfo: boolean;
		overallComplete: boolean;
		educationExperience: boolean;
	};
	searchVector: string;
	educationentries: EducationEntry[];
	workexperienceentries: WorkExperienceEntry[];
	highPotentialAnswer: string;
	challengeAnswer: string;
	bio: string;
	assessmentScore: number;
};