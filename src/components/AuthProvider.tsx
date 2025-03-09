"use client";

// import { useEffect } from "react";

import { createClient, userStore } from "@/lib/store";

export default function AuthProvider({initialState}) {
	// const client = createClient();

    const setUser = userStore((state) => state.setUser);
    const logout = userStore((state) => state.logout);


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
