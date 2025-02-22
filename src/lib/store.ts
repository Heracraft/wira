// exports browser clients and global state

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

import { create } from "zustand";

// import { userObject } from "@/types/auth";

type userObject{
  
}

type State = {
	user: userObject | null;
};

type Action = {
	setUser: (user: userObject) => void;
	logout: () => void;
};

// TODO: write the types for the user store
export const userStore = create<State & Action>((set) => ({
	user: null,
	setUser: (user: userObject) => set({ user }),
	logout: () => set({ user: null }),
}));
