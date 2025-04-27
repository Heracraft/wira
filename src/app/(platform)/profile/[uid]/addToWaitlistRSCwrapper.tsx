import { sql, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { waitlist } from "@/db/schema";

import AddToWaitlist from "./addToWaitlist";

// A server component wrapper for the client component
// This is necessary because we need to check (on the server) if the user is already on the waitlist
// before rendering the client component
// More importantly, we want to do this check on the server after the page has been rendered
// This mkaes the page load faster by reducing the no of fetches/requests made by the server before rendering the page

export default async function AddToWaitlistRSCwrapper({ talentId, employerUid }: { talentId: number, employerUid: string }) {
	const isOnWaitlist = (await db.select().from(waitlist).where(and(eq(waitlist.talentId, talentId), eq(waitlist.employerId, employerUid))))[0]?.waitlistId ? true : false;

	return <AddToWaitlist talentId={talentId} isOnWaitlist={isOnWaitlist}/>;
}
