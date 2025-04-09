"use client";

import { useEffect } from "react";

import { createClient, userStore } from "@/lib/store";

import { User } from "@/types/auth";

export default function AuthProvider() {
	const client = createClient();

	const setUser = userStore((state) => state.setUser);
	const logout = userStore((state) => state.logout);

	//  Unnecessary for now.

	useEffect(() => {
		client.auth.getSession().then(({ data: { session } }) => {
			if (session) {
				setUser({
					email: session.user.email,
					id: session.user.id,
					userType: session.user.user_metadata.userType,
				} as User);
			}
		});

		const {
			data: { subscription },
		} = client.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				if (!session) return;
				console.log({ event });
				setUser({
					email: session.user.email,
					id: session.user.id,
					userType: session.user.user_metadata.userType,
				} as User);
			}
			if (event === "SIGNED_OUT") {
				console.log("signed out");
				logout();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);
	return <></>;
}
