"use client";

import { Button } from "@/components/ui/button";

import { Check, X } from "lucide-react";

import type { Plan } from "@/types";

const defaultOnClickHandler = (planName: string) => {
	if (planName === "Enterprise") {
		window.open("mailto:admin@tu-fund.com", "_blank");
	} else {
		window.location.href = `/auth/sign-up?account-type=employer&plan=${planName}`;
	}
};

export function PricingCard({ plan, user, currentPlanName, onClickHandler = defaultOnClickHandler }: { plan: Plan; user?: any; currentPlanName?: string | null; onClickHandler?: (planName: string) => void }) {
	return (
		<div className="relative flex w-full max-w-xs flex-col rounded-xl border bg-background p-6">
			<div className="flex w-full justify-end">
				<h2 className="text-lg font-semibold">{plan.planName}</h2>
			</div>

			{plan.planName === "Pro" && <div className="absolute -top-2.5 right-6 inline-block rounded-full bg-primary px-3 py-1 text-xs text-white">Popular</div>}

			{plan.planName === "Enterprise" ? (
				<p className="text-3xl font-bold">Contact us</p>
			) : (
				<div className="flex items-center gap-1">
					<p className="text-3xl font-bold">${plan.amount}</p>
					<span className="h-fit text-muted-foreground">/{plan.billingPeriod}</span>
				</div>
			)}

			<p className="text-sm text-gray-500">{plan.description}</p>

			<ul className="my-4 flex flex-col gap-2">
				<li>
					<Check className="mr-2 inline h-4 w-4 text-emerald-500" />
					<span className="text-sm text-muted-foreground">Engage talents</span>
				</li>
				<li>
					<Check className="mr-2 inline h-4 w-4 text-emerald-500" />
					<span className="text-sm text-muted-foreground">
						Full profile views:
						{plan.talentEngagementLimit ? ` ${plan.talentEngagementLimit}/month` : " Custom"}
					</span>
				</li>
				<li>
					{plan.planName !== "Enterprise" ? <Check className="mr-2 inline h-4 w-4 text-emerald-500" /> : <X className="mr-2 inline h-4 w-4 text-destructive" />}
					<span className="text-sm text-muted-foreground">1 month Free trial</span>
				</li>
				<li>
					{plan.features.documentVerification ? <Check className="mr-2 inline h-4 w-4 text-emerald-500" /> : <X className="mr-2 inline h-4 w-4 text-destructive" />}
					<span className="text-sm text-muted-foreground">Document verification</span>
				</li>
				<li>
					{plan.features.onboardingAssistance ? <Check className="mr-2 inline h-4 w-4 text-emerald-500" /> : <X className="mr-2 inline h-4 w-4 text-destructive" />}
					<span className="text-sm text-muted-foreground">Onboarding assistance</span>
				</li>
				<li>
					{plan.features.legalSupport ? <Check className="mr-2 inline h-4 w-4 text-emerald-500" /> : <X className="mr-2 inline h-4 w-4 text-destructive" />}
					<span className="text-sm text-muted-foreground">Legal support</span>
				</li>
			</ul>

			{user && user?.userType === "talent" ? (
				// If pricing tiers are not available for the user type, show a disabled button.
				// Unauthed users will not see this button.
				<Button disabled className="w-full">
					Unavailable for your account type
				</Button>
			) : (
				<>
					{currentPlanName === `${plan.planName} Plan` ? (
						<Button disabled className="w-full">
							Current plan
						</Button>
					) : (
						<Button
							onClick={() => {
								onClickHandler(plan.planName);
							}}
							variant={plan.actionButtonConfig.variant as "outline" | "default" | "link" | "destructive" | "secondary" | "ghost" | null | undefined}
							className="mt-auto w-full"
						>
							{!currentPlanName ? <>{plan.actionButtonConfig.label}</> : <>Upgrade to {plan.planName} Plan</>}
						</Button>
					)}
				</>
			)}
		</div>
	);
}
