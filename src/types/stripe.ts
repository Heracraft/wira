import Stripe from "stripe";

export interface Plan {
	planName: string;
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
