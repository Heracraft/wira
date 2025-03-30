import {stripeAdmin as stripe} from "@/lib/store.server"

export default function Page({searchParams}: {searchParams: {session_id: string}}) {
    const checkoutSessionId = searchParams.session_id

    // ...
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <h1 className="text-3xl font-bold">Subscription Failed</h1>
            <p className="mt-4 text-lg">Your subscription was not successful. Please try again.</p>
        </div>
    );
}