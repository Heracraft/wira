import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type buttonState = {
	isSubmitting: boolean;
	isSubmitted: boolean;
	isSubmitSuccessful: boolean;
	isValid: boolean;
};

type buttonProps = {
	className?: string;
	children: React.ReactNode;
	buttonState: buttonState;
	loadingText?: string;
};

export default function SubmitButton({ className, children, buttonState, loadingText }: buttonProps) {
	const { isSubmitting, isSubmitSuccessful, isSubmitted, isValid } = buttonState;

	if (isSubmitting) {
		return (
			<Button type="submit" className={cn("w-full flex items-center gap-2",className)}>
				<Loader2 className="animate-spin" size={20} />
				{loadingText || children + "ing"}
			</Button>
		);
	}
	if (!isValid && isSubmitted && !isSubmitSuccessful) {
		return (
			<Button disabled type="submit" className={cn("w-full",className)}>
				{children}
			</Button>
		);
	}
	return (
		<Button type="submit" className={cn("w-full",className)}>
			{children}
		</Button>
	);
}
