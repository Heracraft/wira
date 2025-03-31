import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePicture({ className, fullName, avatarUrl }: { className?: string; fullName: string; avatarUrl: string }) {
	return (
		<Avatar className={className}>
			<AvatarImage src={avatarUrl} />
			<AvatarFallback>
				{fullName
					.split(" ")
					.map((el) => el[0])
					.join("")}
			</AvatarFallback>
		</Avatar>
	);
}