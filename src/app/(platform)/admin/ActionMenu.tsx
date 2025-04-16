"use client"

// import { revalidatePath } from "next/cache";

import { resetUser } from "./actions";
import { toast } from "sonner";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function ActionMenu({ user }:{user:any}) {
	return (
		<DropdownMenuContent>
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>Delete</DropdownMenuItem>
			<DropdownMenuItem
				onClick={async () => {
					if (!user.user_metadata.userType) {
						toast.error("User type not found");
						return;
					}
					try {
						await resetUser(user.id, user.user_metadata.userType);
						toast.success("User reset successfully");
					} catch (error) {
						console.log(error);
						toast.error("Failed to reset user");
						return;
					}
				}}
			>
				Reset User
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
