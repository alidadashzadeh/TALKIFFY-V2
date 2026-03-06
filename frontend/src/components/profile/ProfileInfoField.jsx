import { Mail, User } from "lucide-react";

const iconMap = {
	user: User,
	mail: Mail,
};

function ProfileInfoField({ icon, label, value }) {
	const Icon = iconMap[icon];

	return (
		<div className="w-full py-3">
			<p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
				{Icon ? <Icon className="h-4 w-4" /> : null}
				{label}
			</p>

			<input
				className="w-full border-b border-border bg-transparent pb-1 outline-none opacity-70"
				value={value}
				disabled
				readOnly
			/>
		</div>
	);
}

export default ProfileInfoField;
