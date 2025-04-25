import { eq } from "drizzle-orm";

import { db } from "@/db";
import { waitlist, talentProfiles, users } from "@/db/schema";

import ActionMenu from "./ActionMenu";

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { EllipsisVertical } from "lucide-react";

import { createClient } from "@/lib/store.server";

async function getWaitlistedTalents(employerId: string) {
	const results: {
		name: string | null;
		phoneNumber: string | null;
		email: string;
		waitlistId?: number;
	}[] = await db
		.select({
			name: talentProfiles.fullName,
			phoneNumber: talentProfiles.phoneNumber,
			email: users.email,
			waitlistId: waitlist.waitlistId,
		})
		.from(waitlist)
		.innerJoin(talentProfiles, eq(waitlist.talentId, talentProfiles.profileId))
		.innerJoin(users, eq(talentProfiles.userId, users.userId))
		.where(eq(waitlist.employerId, employerId));
	return results;
}

// Useless for now, but could be useful in the future.

// async function updateWaitlistStatus(waitlistId: number, status: "pending" | "engaged" | "removed") {
//     await db
//         .update(waitlist)
//         .set({ status })
//         .where(waitlist.waitlistId.eq(waitlistId));
// }

export default async function Page() {
	const client = await createClient();

	const {
		data: { user },
	} = await client.auth.getUser();

	if (!user) {
		return <p>Unauthorized</p>;
	}
	const uid = user.id;

	let waitlistedTalents = await getWaitlistedTalents(uid);

	if (waitlistedTalents.length == 0) {
		return (
			<>
				<h3 className="text-lg font-semibold">Waiting List</h3>
				<div className="mt-5 rounded border border-dashed p-5">
					<p className="text-muted-foreground">You have no one on the waitlist</p>
				</div>
			</>
		);
	} else {
		const headerItems = ["Name", "Phone", "Email"];

		return (
			<div className="flex flex-col gap-3">
				<h3 className="text-lg font-semibold">Waiting List</h3>
				{/* TODO: add actions (remove)*/}
				<div className="relative overflow-x-auto">
					<table className="w-full border text-left text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
						<thead className="bg-neutral-50 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-400">
							<tr className="">
								{headerItems.map((item) => (
									<th key={item} scope="col" className="border-b px-6 py-3">
										{item}
									</th>
								))}
								<th scope="col" className="border-b px-6 py-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{waitlistedTalents.map((entry, index) => {
								const { waitlistId } = entry;
								delete entry.waitlistId;
								if (!waitlistId) return null; // only here to satisfy typescript
								return (
									<tr key={index} className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
										{Object.values(entry).map((item, index) => {
											return (
												<td key={index} className="px-6 py-4">
													{item as any}
												</td>
											);
										})}
										<td className="px-6 py-4">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant={"ghost"} size={"icon"}>
														<EllipsisVertical />
													</Button>
												</DropdownMenuTrigger>
												<ActionMenu waitlistId={waitlistId} employerId={user.id} />
											</DropdownMenu>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
