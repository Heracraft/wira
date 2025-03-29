"use client";

import { useState, useContext } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

import { ImagePlus, Loader2 } from "lucide-react";

import { toast } from "sonner";

import { updateTalentProfile } from "../../actions";
// TODO: document import heirachy & global state & /types folder
import { CompanyProfileContext } from "../context";

import { userStore } from "@/lib/store";

import { createClient } from "@/lib/store";
import { Input } from "@/components/ui/input";

async function uploadAvatar(file: File, uid: string, fileName: string) {
	try {
		const supabase = createClient();
		const avatrPath = `avatars/${uid}-${fileName}`;
		const { error: uploadError } = await supabase.storage.from("static").upload(avatrPath, file, { upsert: true });

		if (uploadError) {
			throw new Error(uploadError.message);
		}

		// Generate the public URL for the uploaded file
		const { data: publicUrlData } = supabase.storage.from("static").getPublicUrl(avatrPath);

		if (publicUrlData) {
			return publicUrlData.publicUrl;
		}
	} catch (error: any) {
		console.log(error);

		throw new Error(error.message);
	}
}

export default function SettingsPage() {
	const context = useContext(CompanyProfileContext);
	const user = userStore((state) => state.user);

	const [avatarUrl, setAvatarUrl] = useState(context?.avatarUrl);
	const [uploadStatus, setUploadStatus] = useState<"uploading" | "idle">("idle");

	return (
		<div className="flex flex-col gap-5">
			<h3 className="text-base font-medium">Account Settings</h3>
			<div className="space-y-2">
				<Label>Avatar</Label>
				<Avatar className="group relative size-28">
					{(() => {
						if (uploadStatus === "uploading") {
							return (
								<div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
									<Loader2 size={20} className="animate-spin" />
								</div>
							);
						} else {
							return (
								<>
									<label htmlFor="avatar">
										<div className="absolute inset-0 hidden place-content-center rounded-full bg-black/10 backdrop-blur-[2px] hover:cursor-pointer group-hover:grid">
											<ImagePlus size={20} className="text-muted" />
										</div>
									</label>
									<input
										id="avatar"
										type="file"
										className="sr-only"
										onChange={async (e) => {
											try {
												const avatar = e.target.files ? e.target.files[0] : null;
												if (!avatar || !context?.userId) return;

												if (avatar.size > 20 * 1024 * 1024) {
													toast.error("File size must be less than 20MB");
													return;
												}

												if (avatar.type !== "image/jpeg" && avatar.type !== "image/png") {
													toast.error("File must be a JPG or PNG");
													return;
												}

												const fileName = avatar.name;
												setUploadStatus("uploading");

												const avatarUrl = await uploadAvatar(avatar, context.userId, fileName);

												if (!avatarUrl) throw new Error("Error uploading avatar.");

												await updateTalentProfile({ avatarUrl }, context.userId);

												setAvatarUrl(avatarUrl);
												setUploadStatus("idle");
												// const uid
											} catch (error) {
												console.log(error);
												toast.error("An error occurred, try again.");
											}
										}}
									/>
								</>
							);
						}
					})()}
					<AvatarImage src={avatarUrl || undefined} />
					{/* <AvatarFallback className="text-2xl">
						{context?.fullName
							?.split(" ")
							.map((el) => el[0])
							.join("") || ""}
					</AvatarFallback> */}
				</Avatar>
			</div>
			<div className="space-y-2">
				<Label>Account type</Label>
				{user?.userType && <Input disabled value={user.userType} />}
			</div>
		</div>
	);
}
