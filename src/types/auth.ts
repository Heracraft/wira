export type User = {
	id: string;
	email: string;
	userType: "talent" | "employer";
} | null;
