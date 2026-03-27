import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import useCurrentUser from "../user/useCurrentUser";
import { useMessagesContext } from "@/contexts/MessagesContext";

function useSendMessage() {
	const queryClient = useQueryClient();
	const { data: currentUser } = useCurrentUser();
	const { currentConversationId } = useConversationContext();
	const { clearMessageState, setReplyTo } = useMessagesContext();

	const mutation = useMutation({
		mutationFn: async ({ text, file, clientTempId, replyTo }) => {
			const formData = new FormData();
			const trimmedText = text?.trim() || "";

			if (trimmedText) {
				formData.append("content", trimmedText);
			}

			if (file) {
				formData.append("file", file);
			}

			if (replyTo) formData.append("replyToId", replyTo._id);

			formData.append("clientTempId", clientTempId);

			const { data } = await axiosInstance.post(
				`/messages/conversation/${currentConversationId}`,
				formData,
			);

			return data?.data?.newMessage;
		},

		onMutate: async ({ text, file, clientTempId, replyTo }) => {
			if (!currentConversationId) return {};

			const queryKey = ["messages", currentConversationId];

			await queryClient.cancelQueries({ queryKey });

			const previousMessages = queryClient.getQueryData(queryKey) || [];
			const localUrl = file ? URL.createObjectURL(file) : null;
			const trimmedText = text?.trim() || "";

			const optimisticMessage = {
				_id: clientTempId,
				clientTempId,
				conversationId: currentConversationId,
				senderId: {
					_id: currentUser?._id,
					username: currentUser?.username,
					avatar: currentUser?.avatar,
				},
				type: file ? "image" : "text",
				content: trimmedText,
				attachments: file
					? [
							{
								type: "image",
								url: localUrl,
								publicId: "",
								fileName: file.name,
								mimeType: file.type,
								size: file.size,
								localUrl,
							},
						]
					: [],
				replyTo: replyTo || null,
				reactions: [],
				isSeen: false,
				isDelivered: false,
				isEdited: false,
				isDeleted: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				optimistic: true,
			};

			setReplyTo(null);

			queryClient.setQueryData(queryKey, (old = []) => [
				...old,
				optimisticMessage,
			]);

			clearMessageState();

			return {
				queryKey,
				previousMessages,
				clientTempId,
				localUrl,
			};
		},

		onSuccess: (newMessage, _variables, context) => {
			if (!context?.queryKey || !context?.clientTempId) return;

			queryClient.setQueryData(context.queryKey, (old = []) =>
				old.map((message) => {
					if (message.clientTempId !== context.clientTempId) return message;

					const optimisticAttachment = message.attachments?.[0];
					const serverAttachment = newMessage.attachments?.[0];

					return {
						...message,
						...newMessage,
						clientTempId: message.clientTempId,
						createdAt: message.createdAt,
						optimistic: false,
						attachments: serverAttachment
							? [
									{
										...serverAttachment,
										localUrl:
											optimisticAttachment?.localUrl ||
											optimisticAttachment?.url,
									},
								]
							: [],
					};
				}),
			);

			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
		},

		onError: (error, _variables, context) => {
			if (context?.localUrl) {
				URL.revokeObjectURL(context.localUrl);
			}

			if (context?.queryKey && context?.previousMessages) {
				queryClient.setQueryData(context.queryKey, context.previousMessages);
			}

			handleErrorToast(error);
		},

		onSettled: (_data, error, _variables, context) => {
			if (!context?.queryKey) return;

			if (!error && context?.localUrl) {
				setTimeout(() => {
					URL.revokeObjectURL(context.localUrl);
				}, 30000);
			}

			queryClient.invalidateQueries({
				queryKey: context.queryKey,
			});
		},
	});

	return {
		loading: mutation.isPending,
		sendMessage: ({ text, file, replyTo }) => {
			const clientTempId =
				typeof crypto !== "undefined" && crypto.randomUUID
					? crypto.randomUUID()
					: `temp-${Date.now()}-${Math.random()}`;

			return mutation.mutateAsync({
				text,
				file,
				replyTo,
				clientTempId,
			});
		},
	};
}

export default useSendMessage;
