// "use client";

import Sidebar from "./sidebar";

export default function SidebarLayout({ sections, children }: { sections: { label: string; href: string; completionProperty?: string }[]; children: React.ReactNode }) {
	return (
		<div className="relative flex h-full w-full flex-col gap-5 rounded-xl border bg-background sm:flex-row">
			<Sidebar sections={sections} title="Dashboard" isForMobile={false} />
			<div className="h-full max-h-full w-full overflow-y-auto relative">
				<Sidebar sections={sections} title="Dashboard" isForMobile={true} />
				<div className="px-4 md:px-10 py-5 h-full">{children}</div>
			</div>
		</div>
	);
}
