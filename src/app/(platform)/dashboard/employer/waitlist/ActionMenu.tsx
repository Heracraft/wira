"use client";

// import { revalidatePath } from "next/cache";

import { removeFromWaitlist } from "./actions";
import { toast } from "sonner";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function ActionMenu({ waitlistId, employerId }: { waitlistId: number; employerId: string }) {
	return (
		<DropdownMenuContent>
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			{/* <DropdownMenuSeparator /> */}
			<DropdownMenuItem
				className="text-destructive"
				onClick={async () => {
					if (waitlistId == null) {
						toast.error("Waitlist ID not found");
						return;
					}
					try {
						await removeFromWaitlist(waitlistId, employerId);
						toast.success("Removed from waitlist successfully");
					} catch (error) {
						console.log(error);
						toast.error("Failed to remove from waitlist");
						return;
					}
				}}
			>
				
				Remove from Waitlist
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
