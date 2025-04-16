"use client";

// import { useEffect } from "react";
import { Button } from "@/components/ui/button";


export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	// FUTURE: Log the error to an error reporting service

	// useEffect(() => {
	// 	// Log the error to an error reporting service
	// 	console.error(error);
	// }, [error]);

	return (
		<div className="flex h-full w-full flex-1 flex-col items-center justify-center">
			<p className="text-lg md:text-xl font-semibold uppercase text-primary">500</p>
			<div>
				<h2 className="text-2xl md:text-4xl font-bold">Something went wrong!</h2>
				<p className="text-sm text-muted-foreground">{error.message ? error.message : "An unknown error occurred."}, thats all we know.</p>
			</div>
			<Button
				className="mt-5"
				size={"lg"}
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
		</div>
	);
}
