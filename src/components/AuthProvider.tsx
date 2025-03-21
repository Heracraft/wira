"use client";

import { useEffect } from "react";

import { createClient, userStore } from "@/lib/store";

import { User } from "@/types/auth";

export default function AuthProvider({ initialState }: { initialState: User | null }) {
	// const client = createClient();

	const setUser = userStore((state) => state.setUser);
	const logout = userStore((state) => state.logout);

	useEffect(() => {
		if (initialState) setUser(initialState);
	}, []);

	//  Unnecessary for now.

	// useEffect(() => {
	// 	const {
	// 		data: { subscription },
	// 	} = client.auth.onAuthStateChange((event, session) => {
	// 		if (event === "SIGNED_IN") {
	// 			console.log(session);
	//             setUser({ name: session?.user?.email! });
	// 		}
	// 		if (event === "SIGNED_OUT") {
	//             console.log("signed out");
	//             logout();
	// 		}
	// 	});

	// 	return () => {
	// 		subscription.unsubscribe();
	// 	};
	// }, []);
	return <></>;
}
