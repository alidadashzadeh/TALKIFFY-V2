import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

		onMutate: async ({ messageId, emoji, conversationId, currentUser }) => {
			if (!conversationId || !currentUser) return {};

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

					const existingReactionIndex = reactions.findIndex(
						(reaction) =>
							String(reaction.userId?._id || reaction.userId) ===
							String(currentUser._id),
					);

					if (existingReactionIndex === -1) {
						reactions.push({
							userId: {
								_id: currentUser._id,
								username: currentUser.username,
								avatar: currentUser.avatar,
							},
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

		onSuccess: (data, variables) => {
			const updatedMessage = data?.data?.message || data?.message;
			const conversationId = variables?.conversationId;

			if (!updatedMessage || !conversationId) return;

			queryClient.setQueryData(["messages", conversationId], (old = []) =>
				old.map((message) =>
					String(message._id) === String(updatedMessage._id)
						? updatedMessage
						: message,
				),
			);
		},

		onError: (_error, _variables, context) => {
			if (context?.previousMessages && context?.conversationId) {
				queryClient.setQueryData(
					["messages", context.conversationId],
					context.previousMessages,
				);
			}
		},
	});
	return { reactToMessage, loading };
}

export default useReactToMessage;
