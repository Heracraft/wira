"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect, useContext } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants, Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import FromSnapshot from "../../FormSnapshots";
import SubmitButton from "@/components/submitButton";
import MonthPicker from "@/components/MonthPicker";

import { Plus, X, EllipsisVertical, Pencil, Trash2, Loader2 } from "lucide-react";

import { TalentProfileContext } from "../context";
import { createClient, userStore } from "@/lib/store";
import { cn } from "@/lib/utils";

import { updateTalentProfile } from "../../actions";

import { toast } from "sonner";
import type { ProfileCompletion } from "@/types";

const SNAPSHOT_NAME = "form-snapshot-profile";

type EducationEntry = {
	degree: string;
	major: string;
	institution: string;
	startDate: string;
	endDate: string;
	gpa?: string;
};

function EducationForm({ onSubmitHandler, defaultValues }: { onSubmitHandler: (item: EducationEntry) => void; defaultValues?: EducationEntry }) {
	const [entry, setEntry] = useState<EducationEntry>({
		degree: "",
		major: "",
		institution: "",
		startDate: "",
		endDate: "",
		gpa: "",
	});

	useEffect(() => {
		if (defaultValues) {
			setEntry(defaultValues);
		}
	}, []);

	return (
		<>
			<div>
				<Label>
					Degree Program <span className="text-red-500">*</span>
				</Label>
				<Select value={entry.degree} onValueChange={(value) => setEntry({ ...entry, degree: value })}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select degree program" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Bachelor's">Bachelor's</SelectItem>
						<SelectItem value="Master's">Master's</SelectItem>
						<SelectItem value="PhD">PhD</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>
					Institution <span className="text-red-500">*</span>
				</Label>
				<Input value={entry.institution} onChange={(e) => setEntry({ ...entry, institution: e.target.value })} placeholder="University of Example" />
			</div>
			<div>
				<Label htmlFor="major">
					Major/Field of Study <span className="text-red-500">*</span>
				</Label>
				<Input id="major" value={entry.major || ""} onChange={(e) => setEntry({ ...entry, major: e.target.value })} placeholder="e.g., Computer Science" />
			</div>
			<div>
				<Label>
					Enrollment Year <span className="text-red-500">*</span>
				</Label>
				<Input value={entry.startDate} onChange={(e) => setEntry({ ...entry, startDate: e.target.value })} placeholder="2024" />
			</div>
			<div>
				<Label>
					(Expected) graduation Year <span className="text-red-500">*</span>
				</Label>
				<Input value={entry.endDate} onChange={(e) => setEntry({ ...entry, endDate: e.target.value })} placeholder="2026" />
			</div>
			<div>
				<Label>GPA (optional)</Label>
				<Input value={entry.gpa || ""} onChange={(e) => setEntry({ ...entry, gpa: e.target.value })} placeholder="e.g., 3.8" type="number" step="0.01" min="0" max="4" />
			</div>
			<DialogClose asChild>
				<Button onClick={() => onSubmitHandler(entry)} className="w-full bg-neutral-950">
					Add
				</Button>
			</DialogClose>
		</>
	);
}

type WorkExperienceEntry = {
	company: string;
	position: string;
	startDate: Date | string;
	endDate: string | Date;
	description: string;
};

function WorkExperienceForm({ onSubmitHandler, defaultValues }: { onSubmitHandler: (item: WorkExperienceEntry) => void; defaultValues?: WorkExperienceEntry }) {
	const [entry, setEntry] = useState<WorkExperienceEntry>({
		company: "",
		position: "",
		startDate: "",
		endDate: "",
		description: "",
	});

	useEffect(() => {
		if (defaultValues) {
			setEntry(defaultValues);
		}
	}, []);

	return (
		<>
			<div>
				<Label>
					Company/Organization <span className="text-red-500">*</span>
				</Label>
				<Input value={entry.company} onChange={(e) => setEntry({ ...entry, company: e.target.value })} placeholder="Example Corp" />
			</div>
			<div>
				<Label>
					Position <span className="text-red-500">*</span>
				</Label>
				<Input value={entry.position} onChange={(e) => setEntry({ ...entry, position: e.target.value })} placeholder="e.g., Software Engineer" />
			</div>
			<div>
				<Label>
					Start Date <span className="text-red-500">*</span>
				</Label>
				<MonthPicker
					date={entry.startDate as Date}
					currentMonth={new Date()}
					setMonth={(value) => {
						if (value) {
							setEntry((prevState) => {
								return { ...prevState, startDate: value };
							});
						}
					}}
				/>
			</div>
			<div>
				<Label>
					End Date <span className="text-red-500">*</span>
				</Label>
				<MonthPicker
					date={entry.endDate as Date}
					currentMonth={new Date()}
					setMonth={(value) => {
						if (value) {
							setEntry((prevState) => {
								return { ...prevState, endDate: value };
							});
						}
					}}
				/>
			</div>
			<div>
				<Label>
					Description <span className="text-red-500">*</span>
				</Label>
				<Textarea value={entry.description} onChange={(e) => setEntry({ ...entry, description: e.target.value })} placeholder="Describe your role and responsibilities" />
			</div>
			<DialogClose asChild>
				<Button onClick={() => onSubmitHandler(entry)} className="w-full bg-neutral-950">
					Add
				</Button>
			</DialogClose>
		</>
	);
}

async function uploadResume(file: File, uid: string, fileName: string) {
	const supabase = createClient();

	try {
		const resumePath = `resumes/${uid}-${fileName}`;
		const { error: uploadError } = await supabase.storage.from("static").upload(resumePath, file, { upsert: true });

		if (uploadError) {
			throw new Error("Error uploading resume.");
		}

		// Generate the public URL for the uploaded file
		const { data: publicUrlData } = supabase.storage.from("static").getPublicUrl(resumePath);

		if (publicUrlData) {
			return publicUrlData.publicUrl;
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export default function Page() {
	const context = useContext(TalentProfileContext);
	const user = userStore((state) => state.user);

	const profileCompletionStatus = context?.profileCompletionStatus as ProfileCompletion;

	// const [eduBackgroundsRequired, setEduBackgroundsRequired] = useState(1);
	const [editingStatus, setEditingStatus] = useState({
		isEditing: false,
		index: 0,
	});
	const [skillsInput, setSkillsInput] = useState("");
	const [uploadStatus, setUploadStatus] = useState<"uploading" | "uploaded" | "error" | "idle">("idle");

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		setError,
		formState: { isDirty, isSubmitting, isSubmitted, isSubmitSuccessful, isValid },
	} = useForm({
		mode: "onBlur",
	});

	const formValues = watch();

	const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
		try {
			if (!user) {
				throw new Error("User not found");
			}
			const res = await updateTalentProfile(
				{
					...data,
					profileCompletionStatus: {
						personalInfo: profileCompletionStatus.personalInfo,
						educationExperience: true,
						preferences: profileCompletionStatus.preferences,
						assessment:profileCompletionStatus.assessment,
						overallComplete: profileCompletionStatus.overallComplete,
					},
				},
				user.id,
			);
			if (res.status == 400) {
				throw new Error(res.message);
			}
			toast.success(res.message);
			setTimeout(() => {
				// just in case some snapshot has already been debounced to be saved (5 secs)
				localStorage.removeItem(SNAPSHOT_NAME);
			}, 6000);
		} catch (error: any) {
			toast.error("An error occured", {
				description: (error.message as string) + ". Please try again",
			});
		}
	};

	return (
		<form className="flex w-full max-w-xl flex-1 flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
			{/* TODO: change snapshot-name for this page to "education&experience" */}
			<FromSnapshot isDirty={isDirty} formValues={formValues} setValue={setValue} snapshotName="form-snapshot-profile" />
			<div className="flex">
				{/* An empty shell for the mobile sideBarTrigger button to portal into */}
				<div id="mobileSideBarTrigger"></div>
				<h3 className="text-base font-medium">Education & Experience</h3>
			</div>
			<div>
				<Label>Education Background</Label>
				<Controller
					name="education"
					control={control}
					defaultValue={context?.education || []}
					rules={{
						validate: (value) => {
							if (value.length < 1) {
								return "At least one education background is required";
							}
							if (value.length > 3) {
								return "Maximum of 3 education backgrounds allowed";
							}
						},
					}}
					render={({ field, fieldState }) => {
						return (
							<Dialog>
								<div className="mt-2 flex cursor-pointer flex-col justify-center gap-2 rounded border border-dashed p-3">
									{field.value.map((entry: EducationEntry, index: number) => (
										<div key={index} className={cn(buttonVariants({ variant: "outline" }), "flex items-center font-normal")}>
											<div className="max-w-[30ch] flex-1 gap-2 overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-none lg:text-center">{`${entry.degree} in ${entry.major} at ${entry.institution}`}</div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost">
														<EllipsisVertical />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem
														asChild
														onClick={() => {
															setEditingStatus({
																isEditing: true,
																index,
															});
														}}
													>
														<DialogTrigger>
															<Pencil />
															Edit
														</DialogTrigger>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => {
															const newValue = [...field.value];
															newValue.splice(index, 1);
															field.onChange(newValue);
														}}
													>
														<Trash2 />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									))}

									{field.value.length != 3 && (
										<DialogTrigger asChild>
											<Button variant={"outline"} className="max-w-md. flex w-full items-center">
												<Plus className="mr-2" />
												Add entry
											</Button>
										</DialogTrigger>
									)}
								</div>
								{(() => {
									let noOfeduBackgroundsRequired = 1;

									field.value.forEach((entry: EducationEntry) => {
										if (entry.degree == "Master's" && noOfeduBackgroundsRequired < 2) {
											noOfeduBackgroundsRequired = 2;
										}
										if (entry.degree == "PhD" && noOfeduBackgroundsRequired < 3) {
											noOfeduBackgroundsRequired = 3;
										}
									});
									if (field.value.length != noOfeduBackgroundsRequired && !editingStatus.isEditing) {
										return (
											<DialogContent className="flex flex-col gap-2">
												<DialogHeader>
													<DialogTitle>Add Education Background</DialogTitle>
													<DialogDescription>
														Please add at least {noOfeduBackgroundsRequired - field.value.length} more education background
														{noOfeduBackgroundsRequired - field.value.length > 1 ? "s" : ""}.
													</DialogDescription>
												</DialogHeader>
												<EducationForm
													onSubmitHandler={(item: EducationEntry) => {
														field.onChange([...field.value, item]);
													}}
												/>
											</DialogContent>
										);
									}
								})()}

								{/* EDIT dialog */}
								{editingStatus.isEditing && (
									<DialogContent className="flex flex-col gap-2">
										<DialogHeader>
											<DialogTitle>Edit Education Background Entry</DialogTitle>
											<DialogDescription>Update your education background entry.</DialogDescription>
										</DialogHeader>
										<EducationForm
											onSubmitHandler={(item: EducationEntry) => {
												const newValue = [...field.value];
												newValue.splice(editingStatus.index, 1, item);
												field.onChange(newValue);
												setEditingStatus({
													isEditing: false,
													index: 0,
												});
											}}
											defaultValues={field.value[editingStatus.index]}
										/>
									</DialogContent>
								)}
								{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
							</Dialog>
						);
					}}
				/>
			</div>
			<div>
				<Label>Work Experience</Label>
				<Controller
					name="workExperience"
					control={control}
					defaultValue={context?.workExperience || []}
					rules={{
						validate: (value) => {
							if (value.length < 1) {
								return "At least one work experience is required";
							}
							if (value.length > 5) {
								return "Maximum of 5 work experiences allowed";
							}
							return true;
						},
					}}
					render={({ field, fieldState }) => {
						return (
							<Dialog>
								<div className="mt-2 flex cursor-pointer flex-col justify-center gap-2 rounded border border-dashed p-3">
									{field.value.map((entry: WorkExperienceEntry, index: number) => (
										<div key={index} className={cn(buttonVariants({ variant: "outline" }), "flex items-center font-normal")}>
											<div className="max-w-[30ch] flex-1 gap-2 overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-none lg:text-center">{`${entry.position} at ${entry.company}`}</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost">
														<EllipsisVertical />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent onClick={(e) => e.stopPropagation()}>
													<DropdownMenuItem
														asChild
														onClick={() => {
															setEditingStatus({
																isEditing: true,
																index,
															});
														}}
													>
														<DialogTrigger>
															<Pencil />
															Edit
														</DialogTrigger>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => {
															const newValue = [...field.value];
															newValue.splice(index, 1);
															field.onChange(newValue);
														}}
													>
														<Trash2 />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									))}

									<DialogTrigger asChild>
										<Button variant={"outline"} className="max-w-md. flex w-full items-center">
											<Plus className="mr-2" />
											Add entry
										</Button>
									</DialogTrigger>
								</div>

								{/* ADD dialog */}
								<DialogContent className="flex flex-col gap-2">
									<DialogHeader>
										<DialogTitle>Add Work Experience</DialogTitle>
										<DialogDescription>Provide details about your work experience.</DialogDescription>
									</DialogHeader>
									<WorkExperienceForm
										onSubmitHandler={(item: WorkExperienceEntry) => {
											field.onChange([...field.value, item]);
										}}
									/>
								</DialogContent>

								{/* EDIT dialog */}
								{editingStatus.isEditing && (
									<DialogContent className="flex flex-col gap-2">
										<DialogHeader>
											<DialogTitle>Edit Work Experience Entry</DialogTitle>
											<DialogDescription>Update your work experience entry.</DialogDescription>
										</DialogHeader>
										<WorkExperienceForm
											onSubmitHandler={(item: WorkExperienceEntry) => {
												const newValue = [...field.value];
												newValue.splice(editingStatus.index, 1, item);
												field.onChange(newValue);
												setEditingStatus({
													isEditing: true,
													index: 0,
												});
											}}
											defaultValues={field.value[editingStatus.index]}
										/>
									</DialogContent>
								)}
								{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
							</Dialog>
						);
					}}
				/>
			</div>
			<div>
				<Label>Skills</Label>
				<Controller
					control={control}
					name="skills"
					defaultValue={context?.skills || []}
					rules={{
						validate: (value) => {
							if (value.length < 1) {
								return "At least one skill is required";
							}
							if (value.length > 10) {
								return "Maximum of 10 skills allowed";
							}
							return true;
						},
					}}
					render={({ field, fieldState }) => (
						<>
							<div className="flex flex-wrap items-center gap-2 rounded border border-dashed p-3">
								{field.value.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{field.value.map((skill: string, index: number) => (
											<Badge key={index} className="flex cursor-pointer" variant="outline">
												<span className="w-20 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-normal">{skill}</span>
												<X
													size={12}
													className="ml-1"
													onClick={() => {
														const newValue = [...field.value];
														newValue.splice(index, 1);
														field.onChange(newValue);
													}}
												/>
											</Badge>
										))}
									</div>
								)}
								{field.value.length < 10 && (
									<input
										className="rounded border px-4 py-0.5 text-sm !outline-none"
										placeholder="Add a skill"
										value={skillsInput}
										onChange={(e) => setSkillsInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter" && skillsInput.trim() !== "") {
												e.preventDefault(); // otherwise the form will submit
												// e.stopPropagation();
												field.onChange([...field.value, skillsInput.trim()]);
												setSkillsInput("");
											}
										}}
									/>
								)}
							</div>
							{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
						</>
					)}
				/>
			</div>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="picture">
					Upload Resume <span className="text-destructive">*</span>
				</Label>
				{/* Only here to register the field and set the validation rules. Refer to 'entry 1:hacks.md'*/}
				<Controller
					control={control}
					name="resume"
					rules={{
						required: "A resume is required",
					}}
					defaultValue={context?.resume || ""}
					render={({ field, fieldState }) => {
						if (uploadStatus === "uploading") {
							return (
								<div className={cn(buttonVariants({ variant: "outline" }), "items-center gap-2")}>
									<Loader2 size={20} className="animate-spin" />
									Uploading...
								</div>
							);
						}
						if (uploadStatus === "uploaded" || field.value) {
							return (
								<div className={cn(buttonVariants({ variant: "outline" }), "font-normal")}>
									<p className="flex-1 text-center">Uploaded</p>
									<X
										onClick={() => {
											console.log("clicked");

											setUploadStatus("idle");
											setValue("resume", "");
										}}
										size={20}
										className="!pointer-events-auto text-destructive"
									/>
								</div>
							);
						}
						return (
							<>
								<Input
									id="picture"
									type="file"
									placeholder="upload your resume here"
									disabled={uploadStatus === "error"}
									onChange={async (e) => {
										try {
											const resume = e.target.files ? e.target.files[0] : null;
											if (!resume || !context?.userId) return;

											if (resume.size > 100 * 1024 * 1024) {
												setError("resume", { type: "manual", message: "File size must be less than 100MB" });
												return;
											}

											if (resume.type !== "application/pdf") {
												setError("resume", { type: "manual", message: "File must be a PDF" });
												return;
											}

											const fileName = resume.name;
											setUploadStatus("uploading");

											const resumeUrl = await uploadResume(resume, context.userId, fileName);

											setValue("resume", resumeUrl);

											setUploadStatus("uploaded");
											// const uid
										} catch (error) {
											console.log(error);
											setError("resume", { type: "manual", message: "An error occurred, try again." });
											setUploadStatus("error");
											setTimeout(() => {
												setUploadStatus("idle");
											}, 5000);
										}
									}}
								/>
								{fieldState.error && <p className="mt-2 text-xs text-destructive">{fieldState.error.message}</p>}
							</>
						);
					}}
				/>
			</div>
			<div className="mt-auto flex justify-end">
				<SubmitButton
					buttonState={{
						isSubmitting,
						isSubmitted,
						isSubmitSuccessful,
						isValid,
					}}
					loadingText="Saving"
					children="Save"
					className="w-fit"
					size="lg"
				/>
			</div>
		</form>
	);
}
