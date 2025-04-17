// Only here because useSearchParams() should be wrapped in a suspense boundary at page "/onboarding"
// This essentially wraps the entire page in a suspense boundary
// and shows a loading state while the search params are being resolved
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<Skeleton className="flex max-w-md flex-1 flex-col gap-6 aspect-[9/16]"></Skeleton>
		</div>
	);
}
