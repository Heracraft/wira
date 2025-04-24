"use client";

import { useState } from "react";

import { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, X, Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const passwordRequirements = [
	{ label: "8+ characters", test: (v: string) => v.length >= 8 },
	{ label: "Number", test: (v: string) => /\d/.test(v) },
	{ label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
	{ label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
	{
		label: "Special (!@#$)",
		test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
	},
] as const;

export default function PasswordInput({ hideRequirements, hideStrength, id, ...props }: { hideRequirements?: boolean; hideStrength?: boolean; value?: string; id?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "value">) {
	const { className } = props;
	delete props.className;

	const [showPassword, setShowPassword] = useState(false);

	const value = props.value || "";

	const getStrength = (value: string): number => {
		if (!value) return 0;
		return passwordRequirements.filter((req) => req.test(value)).length * 20;
	};

	const strength = getStrength(value);
	const strengthLabel = strength <= 40 ? "Weak" : strength <= 80 ? "Medium" : "Strong";

	const isPasswordValid = passwordRequirements.every((req) => req.test(value));

	return (
		<>
			<div className="flex items-center rounded-md focus-within:ring-1 focus-within:ring-foreground">
				<Input
					id={id}
					type={showPassword ? "text" : "password"}
					// value={value}
					// onChange={(e) => onChange(e.target.value)}
					placeholder="Enter your password"
					className={cn("rounded-r-none", className)}
					{...props}
				/>
				<button className="h-full rounded-r-md border px-2 text-muted-foreground" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>
			{value && !isPasswordValid && (
				<>
					{!hideStrength && (
						<div className="mt-1 flex items-center gap-2">
							<div className="h-2 w-full rounded-md bg-muted-foreground">
								<div className={cn("h-full rounded-md", strength <= 40 ? "bg-red-500" : strength <= 80 ? "bg-yellow-500" : "bg-green-500")} style={{ width: `${strength}%` }}></div>
							</div>
							<span className="text-muted-foreground">{strengthLabel}</span>
						</div>
					)}

					{!hideRequirements && (
						<div className="mt-1 grid gap-1 text-muted-foreground">
							{passwordRequirements.map((req, index) => (
								<div key={index} className="flex items-center">
									{req.test(value) ? <Check size={16} /> : <X size={16} />}
									<span className="text-sm">{req.label}</span>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</>
	);
}
