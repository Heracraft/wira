"use client";

import { Button } from "@/components/ui/button";

import { addToWaitlist } from "./actions";
import { toast } from "sonner";
import { userStore } from "@/lib/store";

export default function AddToWaitlist({ talentId, isOnWaitlist }: { talentId: number; isOnWaitlist: boolean }) {
	const user = userStore((state) => state.user); //the employer

	const handleAddToWaitlist = async () => {
		if (!user) {
			toast.error("Please log in to add to waitlist");
			return;
		}
		const response = await addToWaitlist(user?.id, talentId);
		if (response.status === 200) {
			toast.success("Added to waitlist");
		} else {
			toast.error("Error adding to waitlist");
		}
	};
	if (isOnWaitlist) {
		return (
			<Button disabled size={"lg"}>
				Waitlisted
			</Button>
		);
	} else {
		return (
			<Button onClick={handleAddToWaitlist} size={"lg"}>
				Add to Waitlist
			</Button>
		);
	}
}
