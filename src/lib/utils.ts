import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatSecondsToMinSec(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const formattedTime = new Intl.DateTimeFormat("en-US", {
		minute: "2-digit",
		second: "2-digit",
	}).format(new Date(0, 0, 0, 0, minutes, remainingSeconds));

	return formattedTime;
}

export function maskEmail(email: string) {
	const [localPart, domain] = email.split("@");

	if (localPart.length <= 2) {
		return `${localPart[0]}*...@${domain}`;
	}

	const visiblePart = `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;

	return `${visiblePart}@${domain}`;
}

export function formatToCurrency(amount: number, currency:string="TZS") {
	return new Intl.NumberFormat("sw-IN", { style: "currency", currency }).format(amount);
}