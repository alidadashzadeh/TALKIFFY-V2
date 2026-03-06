import { useEffect } from "react";

import { useContactContext } from "@/contexts/ContactContext";
import useGetMessages from "@/hooks/useGetMessages";

import ChatEmptyState from "./chat/ChatEmptyState";
import ChatMessages from "./chat/ChatMessages";
import ChatHeader from "./chat/ChatHeader";
import ChatMessageBar from "./chat/ChatMessageBar";
import ChatLoading from "./chat/ChatLoading";

function MainContent() {
	const { currentContactId, setCurrentContactId } = useContactContext();
	const { loading, getMessages } = useGetMessages();

	useEffect(() => {
		if (!currentContactId) return;
		getMessages();
	}, [currentContactId, getMessages]);

	useEffect(() => {
		return () => {
			setCurrentContactId(null);
		};
	}, [setCurrentContactId]);

	if (loading) return <ChatLoading />;

	return (
		<main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/20">
			{!currentContactId ? (
				<ChatEmptyState />
			) : (
				<>
					<div className="shrink-0 bg-background">
						<ChatHeader />
					</div>

					<div className="min-h-0 flex-1">
						<ChatMessages />
					</div>

					<div className="shrink-0 p-3 sm:p-4">
						<div className="mx-auto w-full max-w-4xl">
							<ChatMessageBar loading={loading} />
						</div>
					</div>
				</>
			)}
		</main>
	);
}

export default MainContent;
