export type User = {
	id: string;
	email: string;
	profile?: {
		avatarUrl: string;
		firstName: string;
		lastName: string;
	};
	userType?: "talent" | "employer";
};
