export default function Page() {
	return (
		<main className="w-full grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold text-primary">500</p>
				<h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Internal Server Error</h1>
				<p className="mt-6 text-pretty text-lg font-medium text-neutral-500 sm:text-xl/8">Sorry, An error occurred. That's all we know.</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a href="/event" className="shadow-xs rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Go back home
					</a>
					<a href="mailto:brockentechnologies@gmail.com" className="text-sm font-semibold text-gray-900">
						Contact support <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</main>
	);
}
