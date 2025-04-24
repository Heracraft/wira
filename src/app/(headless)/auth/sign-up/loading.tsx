// Only here because useSearchParams() should be wrapped in a suspense boundary at page "/auth/sign-up"
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<Skeleton className="flex max-w-md flex-1 flex-col gap-6 aspect-[9/16]"></Skeleton>
		</div>
	);
}
