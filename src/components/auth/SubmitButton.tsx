import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

type buttonState = {
	isSubmitting: boolean;
	isSubmitted: boolean;
	isSubmitSuccessful: boolean;
	isValid: boolean;
};

type buttonProps = {
	children: React.ReactNode;
	buttonState: buttonState;
	loadingText?: string;
};

export default function SubmitButton({ children, buttonState, loadingText }: buttonProps) {
	const { isSubmitting, isSubmitSuccessful, isSubmitted, isValid } = buttonState;

	if (isSubmitting) {
		return (
			<Button type="submit" className="w-full flex items-center gap-2">
				<Loader2 className="animate-spin" size={20} />
				{loadingText || children + "ing"}
			</Button>
		);
	}
	if (!isValid && isSubmitted && !isSubmitSuccessful) {
		return (
			<Button disabled type="submit" className="w-full">
				{children}
			</Button>
		);
	}
	return (
		<Button type="submit" className="w-full">
			{children}
		</Button>
	);
}