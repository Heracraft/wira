export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex justify-center w-full flex-1 p-5 md:px-20 xl:px-36 min-h-[80dvh]">
			<div className="w-full flex bg-background gap-5 rounded-xl border">{children}</div>
		</div>
	);
}
