// exports browser clients and global state

import { createBrowserClient } from "@supabase/ssr";
// import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { loadStripe } from "@stripe/stripe-js";

import { User } from "@/types/auth";

// Had to memoize this to prevent re-creating the client on every render/page. 
// Otherwise auth events would not be fired to one client and not the other
// You can read more at https://github.com/orgs/supabase/discussions/4035#discussioncomment-1704355

const client=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
	auth:{
		persistSession:true,
		autoRefreshToken:true
	}
});

export const createClient = () => client


// export function createClient() {
// 	return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
// }

// export const createClient=useMemo(()=>createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),[])

import { create } from "zustand";


type State = {
	user: User | null;
};

type Action = {
	setUser: (user: User) => void;
	logout: () => void;
};

export const userStore = create<State & Action>((set) => ({
	user: null,
	setUser: (user: User) => set({ user }),
	logout: () => set({ user: null }),
}));

export const profileStore=create((set) => ({
	profile: null,
	setProfile: (profile: any) => set({ profile }),
	clear: () => set({ profile: null }),
}))

