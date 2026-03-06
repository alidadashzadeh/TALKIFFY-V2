function ChatEmptyState() {
	return (
		<div className="flex h-full items-center justify-center px-6 text-center">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold tracking-tight">
					Select a contact
				</h2>
				<p className="text-sm text-muted-foreground sm:text-base">
					Choose a conversation from the sidebar to start chatting.
				</p>
			</div>
		</div>
	);
}

export default ChatEmptyState;
