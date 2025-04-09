import { db } from "@/db";
import { educationEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EducationTable({ profileId, limit }: { profileId: number; limit: number }) {
	const entries = await db
		.select({
			degree: educationEntries.degree,
			major: educationEntries.major,
			institution: educationEntries.institution,
			startDate: educationEntries.startDate,
			endDate: educationEntries.endDate,
		})
		.from(educationEntries)
		.where(eq(educationEntries.profileId, profileId))
		.limit(limit);

	const headerItems = ["Degree", "Major", "Institution", "Start Date", "End Date"];

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-lg font-semibold">Education Background</h3>
			<div className="relative overflow-x-auto">
				{entries.length === 0 && <div className="text-center text-neutral-500 dark:text-neutral-400">No education background found.</div>}
				<table className="w-full border text-left text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
					<thead className="bg-neutral-50 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-400">
						<tr className="">
							{headerItems.map((item) => (
								<th key={item} scope="col" className="border-b px-6 py-3">
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{entries.map((entry) => (
							<tr key={entry.degree} className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
								{Object.values(entry).map((item, index) => (
									<td key={index} className="px-6 py-4">
										{item}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
