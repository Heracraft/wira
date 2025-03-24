"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buttonVariants, Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import SubmitButton from "@/components/submitButton";
import MonthPicker from "@/components/MonthPicker";

import { Plus, X, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

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

export default function Page() {
	// const [eduBackgroundsRequired, setEduBackgroundsRequired] = useState(1);
	const [isEditing, setIsEditing] = useState(false);
	const [skillsInput, setSkillsInput] = useState("");

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
	});

	const formValues = watch();

	useEffect(() => {
		// Save form values to local storage every 10 seconds
		const handler = setTimeout(() => {
			localStorage.setItem("form-snapshot-profile", JSON.stringify(formValues));
		}, 5000);

		return () => clearTimeout(handler);
	}, [formValues]);

	useEffect(() => {
		// Load form values from local storage on component mount
		const snapshot = localStorage.getItem("form-snapshot-profile");
		if (snapshot) {
			const parsedSnapshot = JSON.parse(snapshot);
			Object.keys(parsedSnapshot).forEach((key) => {
				setValue(key, parsedSnapshot[key]);
			});
		}
	}, []);

	return (
		<form className="flex max-w-xl flex-1 flex-col gap-5 p-10" onSubmit={handleSubmit((data) => console.log(data))}>
			<h3 className="text-lg font-medium">Personal Info</h3>
			<div>
				<Label>Education Background</Label>
				<Controller
					name="education"
					control={control}
					defaultValue={[]}
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
											<div className="flex flex-1 justify-center gap-2">
												<span>{entry.degree}</span>
												<span>-</span>
												<span className="text-sm">{entry.institution}</span>
											</div>
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
															setIsEditing(true);
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
									if (field.value.length != noOfeduBackgroundsRequired && !isEditing) {
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
								{isEditing && (
									<DialogContent className="flex flex-col gap-2">
										<DialogHeader>
											<DialogTitle>Edit Education Background Entry</DialogTitle>
											<DialogDescription>Update your education background entry.</DialogDescription>
										</DialogHeader>
										<EducationForm
											onSubmitHandler={(item: EducationEntry) => {
												const newValue = [...field.value];
												newValue.splice(0, 1, item);
												field.onChange(newValue);
												setIsEditing(false);
											}}
											defaultValues={field.value[0]}
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
					defaultValue={[]}
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
											<div className="flex flex-1 justify-center gap-2">
												<span>{entry.company}</span>
												<span>-</span>
												<span>{entry.position}</span>
											</div>
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
															setIsEditing(true);
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
								{isEditing && (
									<DialogContent className="flex flex-col gap-2">
										<DialogHeader>
											<DialogTitle>Edit Work Experience Entry</DialogTitle>
											<DialogDescription>Update your work experience entry.</DialogDescription>
										</DialogHeader>
										<WorkExperienceForm
											onSubmitHandler={(item: WorkExperienceEntry) => {
												const newValue = [...field.value];
												newValue.splice(0, 1, item);
												field.onChange(newValue);
												setIsEditing(false);
											}}
											defaultValues={field.value[0]}
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
					defaultValue={[]}
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
			<div className="mt-auto flex justify-end">
				<SubmitButton
					buttonState={{
						isSubmitting: false,
						isSubmitted: false,
						isSubmitSuccessful: false,
						isValid: true,
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
