// local snapshots of major forms like the dashoboard forms are saved offline
// in the browser's local storage. The saving is debounced to prevent excessive
// writes to the local storage.

// This componet basically renders a dialog that allows the user to restore
// a form from a snapshot.

// Works really well except for one thing.
// When the form is submitted, a snapshot is saved to the local storage
// This is because isDirty becomes true when the form is submitted
// and the form values are saved to the local storage.
// Solution: compare the form values with the snapshot and if they are the same
// dont render the dialog.

"use client";

import { useEffect, useState } from "react";

import type { UseFormSetValue, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose, DialogDescription, DialogHeader } from "@/components/ui/dialog";

import {deepEqual} from "@/lib/utils"

const isSnapshotEmpty = (obj: FieldValues): boolean => {
	// console.log( "checking if empty",{obj}, Object.values(obj).length);
	
	return Object.values(obj).length == 0 || Object.values(obj).every((value) => value === null || value === "" || value === undefined || value.length === 0);
};

export default function RestoreFromSnapshot({ isDirty, formValues, setValue, snapshotName }: { isDirty: boolean; formValues: FieldValues; setValue: UseFormSetValue<FieldValues>; snapshotName: string }) {
	const [snapshot, setFormSnapshot] = useState<FieldValues>({});

	useEffect(() => {
		// console.log("thinking of saving");
		
		// Save form values to local storage every 10 seconds
		if (!isDirty) return;
		// saving
		const handler = setTimeout(() => {
			if (isSnapshotEmpty(formValues)) return
			console.log("taking a snapshot");
			localStorage.setItem(snapshotName, JSON.stringify(formValues));
		}, 5000);

		return () => clearTimeout(handler);
	}, [formValues]);

	useEffect(() => {
		// Load form values from local storage on component mount
		const snapshot = localStorage.getItem(snapshotName);
		if (snapshot && !deepEqual(formValues, JSON.parse(snapshot))) {
			const parsedSnapshot = JSON.parse(snapshot);
			setFormSnapshot(parsedSnapshot);
		}
		else{
			localStorage.removeItem(snapshotName);
		}
	}, []);

	// console.log({isDirty});

	return (
		!isSnapshotEmpty(snapshot) && (
			<Dialog defaultOpen={true}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Restore from Snapshot</DialogTitle>
						<DialogClose />
					</DialogHeader>
					<DialogDescription>You have unsaved changes. Would you like to restore from the last saved snapshot?</DialogDescription>
					<div className="flex w-full justify-end gap-2 [&_button]:font-normal">
						<DialogClose asChild>
							<Button
								variant={"destructive"}
								size={"lg"}
								onClick={() => {
									localStorage.removeItem(snapshotName);
								}}
							>
								Discard
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								variant={"outline"}
								size={"lg"}
								onClick={() => {
									Object.keys(snapshot).forEach((key) => {
										setValue(key, snapshot[key]);
									});
								}}
							>
								Restore
							</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		)
	);
}
