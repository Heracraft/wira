"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Check, X } from "lucide-react";

import { userStore } from "@/lib/store";
import { plans } from "@/lib/shared";

import type { Plan } from "@/types/stripe";

export function PricingCard({ plan, user, action }: { plan: Plan; user: any; action: (planName: string, userType: string) => void }) {
	return (
		<div className="flex w-full max-w-xs flex-col rounded-xl border bg-background p-6">
			<div className="flex w-full justify-end">
				<h2 className="text-lg font-semibold">{plan.planName}</h2>
			</div>

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
			{/* TODO: change text to upgrade now if employer is logged in */}

			{user?.userType === "talent" ? (
				// If pricing tiers are not available for the user type, show a disabled button. 
				// Unauthed users will not see this button.
				<Button disabled className="w-full">
					Unavailable for your account type
				</Button>
			) : (
				<Button
					onClick={() => {
						action(plan.planName, user.userType);
					}}
					variant={plan.actionButtonConfig.variant as "outline" | "default" | "link" | "destructive" | "secondary" | "ghost" | null | undefined}
					className="mt-auto w-full"
				>
					{plan.actionButtonConfig.label}
				</Button>
			)}
		</div>
	);
}

export default function Page() {
	const user = userStore((state) => state.user);

	return (
		<div className="flex flex-1 flex-col items-center gap-5 bg-background p-5 md:px-20 xl:px-32">
			<h1 className="font text-3xl font-bold">Simple, transparent pricing</h1>
			<div className="grid w-full grid-cols-1 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3">
				{plans.map((plan, index) => (
					<PricingCard
						key={index}
						plan={plan as Plan}
						user={user}
						action={(planName, userType) => {
							if (planName === "Enterprise") {
								window.open("mailto:admin@tu-fund.com", "_blank");
							} else {
								if (!user){
									// user does not exist, redirect to sign up page
									window.location.href = `/auth/sign-up?plan=${planName}`;
								}
								else{
									// user exists, redirect to checkout page
									// window.location.href = `/checkout?plan=${planName}&userType=${userType}`;
									// TODO: implement plan upgrading.
								}
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}
