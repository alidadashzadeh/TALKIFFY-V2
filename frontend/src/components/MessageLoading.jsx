function MessageLoading() {
	return (
		<div className="h-screen w-screen bg-background__primary flex flex-col gap-4 justify-center items-center">
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
			<p className="text-sm text-muted-foreground">Loading messages...</p>
		</div>
	);
}

export default MessageLoading;
