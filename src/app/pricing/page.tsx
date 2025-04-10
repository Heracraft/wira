"use client";

import { PricingCard } from "@/components/PricingCard";

import { userStore } from "@/lib/store";
import { plans } from "@/lib/shared";

import type { Plan } from "@/types";

// TODO: buttons should react to userType and subscription states/status.

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
						action={(planName) => {
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
