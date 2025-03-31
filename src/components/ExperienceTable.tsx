import { db } from "@/db";
import { workExperienceEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ExperienceTable({ profileId, limit }: { profileId: number; limit: number }) {
	const entries = await db.select({
        position: workExperienceEntries.position,
        company: workExperienceEntries.company,
        startDate: workExperienceEntries.startDate,
        endDate: workExperienceEntries.endDate,
    }).from(workExperienceEntries).where(eq(workExperienceEntries.profileId, profileId)).limit(limit);

	const headerItems = ["Position", "Company", "Start Date", "End Date"];

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-lg font-semibold">Work Experience</h3>
			<div className="relative overflow-x-auto">
                {entries.length === 0 && (
                    <div className="text-center text-neutral-500 dark:text-neutral-400">
                        No work experience found.
                    </div>
                )}
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
							<tr key={entry.company} className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
								{Object.values(entry).map((item,index) => (
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
