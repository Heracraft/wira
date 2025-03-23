"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

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

import SubmitButton from "@/components/submitButton";

import { Plus, X, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

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

export default function Page() {
	// const [eduBackgroundsRequired, setEduBackgroundsRequired] = useState(1);
	const [isEditing, setIsEditing] = useState(false);

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

	return (
		<>
			<h3 className="font-medium text-lg">Personal Info</h3>
			<div>
				<Label>Education Background</Label>
				<Controller
					name="education"
					control={control}
					defaultValue={[]}
					rules={{ required: "At least one education entry is required" }}
					render={({ field, fieldState }) => {
						return (
							<Dialog>
								<div className="mt-2 p-3 gap-2 border border-dashed rounded cursor-pointer flex flex-col justify-center">
									{field.value.map((entry: EducationEntry, index: number) => (
										<div key={index} className={cn(buttonVariants({ variant: "outline" }), "flex items-center font-normal")}>
											<div className="flex-1 flex justify-center gap-2">
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
											<Button variant={"outline"} className="flex items-center w-full max-w-md.">
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
														Please add at least {noOfeduBackgroundsRequired - field.value.length} more education background{noOfeduBackgroundsRequired - field.value.length > 1 ? "s" : ""}.
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
							</Dialog>
						);
					}}
				/>
			</div>
			<div>
				<Label>Work Experience</Label>
			</div>
			<div>
				<Label>Skills</Label>
			</div>
			<div className="flex justify-end mt-auto">
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
		</>
	);
}
