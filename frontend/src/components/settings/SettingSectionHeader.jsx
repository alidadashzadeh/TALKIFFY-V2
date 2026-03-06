function SettingSectionHeader({ title, description }) {
	return (
		<div>
			<p className="text-sm font-semibold">{title}</p>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

export default SettingSectionHeader;
