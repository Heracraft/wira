// TODO: remove from prod

import { adminClient } from "@/lib/store.server";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { EllipsisVertical } from "lucide-react";

import ActionMenu from "./ActionMenu";

export default async function Page() {
	const supabase = adminClient();
	const response = await supabase.auth.admin.listUsers();

	const usersList = response.data.users;

	// console.log(usersList[0].user_metadata);

	return (
		<div className="bg- felx-1  bg-background p-10">
			<Table>
				<TableCaption>Users List</TableCaption>
				<TableHeader className="bg-neutral-100">
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{usersList.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.user_metadata.userType || null}</TableCell>
							<TableCell>{user.created_at}</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant={"ghost"} size={"icon"}>
											<EllipsisVertical />
										</Button>
									</DropdownMenuTrigger>
									<ActionMenu user={user} />
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
