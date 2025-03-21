// exports browser clients and global state

import { createBrowserClient } from "@supabase/ssr";

import { User } from "@/types/auth";

export function createClient() {
	return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

import { create } from "zustand";


type State = {
	user: User | null;
};

type Action = {
	setUser: (user: User) => void;
	logout: () => void;
};

// TODO: write the types for the user store
export const userStore = create<State & Action>((set) => ({
	user: null,
	setUser: (user: User) => set({ user }),
	logout: () => set({ user: null }),
}));
