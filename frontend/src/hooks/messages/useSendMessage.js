import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/contexts/AuthContext";
import { useConversationContext } from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";

function useSendMessage() {
	const queryClient = useQueryClient();

	const { currentUser } = useAuthContext();
	const { currentConversationId } = useConversationContext();
	const { socket } = useSocketContext();

	const mutation = useMutation({
		mutationFn: async ({ message: messageContent }) => {
			const { data } = await axiosInstance.post(
				`/messages/conversation/${currentConversationId}`,
				{ content: messageContent },
			);

			return data?.data?.newMessage;
		},

		onMutate: async ({ message: messageContent }) => {
			if (!currentConversationId) return {};

			const queryKey = ["messages", currentConversationId];

			await queryClient.cancelQueries({ queryKey });

			const previousMessages = queryClient.getQueryData(queryKey) || [];

			const optimisticMessage = {
				_id: `temp-${Date.now()}`,
				content: messageContent,
				conversationId: currentConversationId,
				senderId: {
					_id: currentUser?._id,
					username: currentUser?.username,
					avatar: currentUser?.avatar,
				},
				createdAt: new Date().toISOString(),
				optimistic: true,
			};

			queryClient.setQueryData(queryKey, (old = []) => [
				...old,
				optimisticMessage,
			]);

			return { previousMessages, optimisticMessage, queryKey };
		},

		onSuccess: (newMessage, _variables, context) => {
			if (!context?.queryKey) return;

			queryClient.setQueryData(context.queryKey, (old = []) =>
				old.map((message) =>
					message._id === context.optimisticMessage._id ? newMessage : message,
				),
			);

			// socket.emit("setMessage", newMessage);
		},

		onError: (error, _variables, context) => {
			if (context?.queryKey && context?.previousMessages) {
				queryClient.setQueryData(context.queryKey, context.previousMessages);
			}

			handleErrorToast(error);
		},

		onSettled: (_data, _error, _variables, context) => {
			if (!context?.queryKey) return;

			queryClient.invalidateQueries({
				queryKey: context.queryKey,
			});
		},
	});

	return {
		loading: mutation.isPending,
		sendMessage: mutation.mutateAsync,
	};
}

export default useSendMessage;
