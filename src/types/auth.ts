export type User = {
	id: string;
	email: string;
	avatarUrl: string | null;
	fullName?: string;
	userType?: "talent" | "employer";
	phoneNumber?: string | null;
	dateOfBirth?: string | null;
	companyName?: string;
};
