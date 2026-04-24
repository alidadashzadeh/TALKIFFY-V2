import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function updateMessageReaction(messages = [], messageId, updatedMessage) {
	return messages.map((message) =>
		String(message._id) === String(messageId) ? updatedMessage : message,
	);
}

function useReactToMessage() {
	const queryClient = useQueryClient();

	const { mutateAsync: reactToMessage, isPending: loading } = useMutation({
		mutationFn: async ({ messageId, emoji }) => {
			if (!messageId) {
				throw new Error("messageId is required");
			}

			if (!emoji) {
				throw new Error("emoji is required");
			}

			const { data } = await axiosInstance.patch(
				`/messages/${messageId}/reaction`,
				{ emoji },
			);

			return data;
		},

		onMutate: async ({ messageId, emoji, conversationId, currentUserId }) => {
			if (!conversationId || !currentUserId) return {};

			await queryClient.cancelQueries({
				queryKey: ["messages", conversationId],
			});

			const previousMessages = queryClient.getQueryData([
				"messages",
				conversationId,
			]);

			queryClient.setQueryData(["messages", conversationId], (old = []) => {
				return old.map((message) => {
					if (String(message._id) !== String(messageId)) return message;

					const reactions = Array.isArray(message.reactions)
						? [...message.reactions]
						: [];

					const existingReactionIndex = message.reactions.findIndex(
						(reaction) => String(reaction.userId) === String(currentUserId),
					);

					if (existingReactionIndex === -1) {
						reactions.push({
							userId: currentUserId,
							emoji,
						});
					} else {
						const existingReaction = reactions[existingReactionIndex];

						if (existingReaction.emoji === emoji) {
							reactions.splice(existingReactionIndex, 1);
						} else {
							reactions[existingReactionIndex] = {
								...existingReaction,
								emoji,
							};
						}
					}

					return {
						...message,
						reactions,
					};
				});
			});

			return { previousMessages, conversationId };
		},

		onError: (_error, _variables, context) => {
			if (context?.previousMessages && context?.conversationId) {
				queryClient.setQueryData(
					["messages", context.conversationId],
					context.previousMessages,
				);
			}
		},

		onSuccess: (data, variables) => {
			const updatedMessage = data?.data?.message || data?.message;
			const conversationId = variables?.conversationId;

			if (!updatedMessage || !conversationId) return;

			queryClient.setQueryData(["messages", conversationId], (old = []) =>
				updateMessageReaction(old, updatedMessage._id, updatedMessage),
			);
		},

		onSettled: (_data, _error, variables) => {
			if (variables?.conversationId) {
				queryClient.invalidateQueries({
					queryKey: ["messages", variables.conversationId],
				});
			}
		},
	});
	return { reactToMessage, loading };
}

export default useReactToMessage;
