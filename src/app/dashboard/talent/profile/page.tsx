"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buttonVariants, Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Page() {
	// const [eduBackgroundsRequired, setEduBackgroundsRequired] = useState(1);

	return (
		<>
			<h3 className="font-medium text-lg">Personal Info</h3>
			<div>
				<Label>Education Background</Label>
				<Popover>
					<PopoverTrigger asChild>
						<div className="mt-2 p-3 border border-dashed rounded cursor-pointer flex justify-center">
							<Button variant={"outline"} className="flex items-center w-full max-w-md.">
								<Plus className="mr-2" />
								Add entry
							</Button>
						</div>
					</PopoverTrigger>
					<PopoverContent className="flex flex-col gap-2">
						<div>
							<Label>Degree</Label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select year" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Bachelor's">Bachelor's</SelectItem>
									<SelectItem value="Master's">Master's</SelectItem>
									<SelectItem value="PhD">
										PhD
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Institution</Label>
							<Input placeholder="University of Example" />
						</div>
                        <div>
                            <Label>Year</Label>
                            <Input placeholder="2022" />
                        </div>

                        <Button className="w-full bg-neutral-950">Add</Button>
					</PopoverContent>
				</Popover>
			</div>
			<div>
				<Label>Work Experience</Label>
			</div>
			<div>
				<Label>Skills</Label>
			</div>
		</>
	);
}
