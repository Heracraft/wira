"use client";

import { useState, useEffect, useCallback } from "react";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export default function DatePickerInput({ date, setDate }: { date: Date | undefined; setDate: React.Dispatch<React.SetStateAction<Date | undefined>> }) {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	// const [date, setDate] = useState<Date>();

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setInputValue(e.currentTarget.value);
		const date = parse(e.currentTarget.value, "dd-MM-y", new Date());
		if (isValid(date)) {
			setDate(date);
		} else {
			setDate(undefined);
		}
	};

	const handleSelectDate = useCallback((selected: any) => {
		setDate(selected);
		if (selected) {
			setOpen(false);
			setInputValue(format(selected, "dd-MM-y"));
		} else {
			setInputValue("");
		}
	}, []);

	useEffect(() => {
		// console.log({ date });

		if (date && !inputValue && typeof date === "string") {
			let rawDate = parse(date as any, "yyyy-MM-dd", new Date()) || new Date(date);
			if (isNaN(rawDate.getTime())) {
				rawDate=new Date(date)
			}
			setInputValue(format(rawDate, "dd-MM-y"));
		}
	}, [date]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<fieldset className="relative">
				<Input placeholder="DD-MM-YYYY" value={inputValue} onChange={handleInputChange} />
				<PopoverTrigger asChild>
					<Button aria-label="Pick a date" variant={"secondary"} className={cn("absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-1.5 font-normal", !date && "text-muted-foreground")}>
						<CalendarIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
			</fieldset>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" defaultMonth={date} selected={date} onSelect={handleSelectDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
}
