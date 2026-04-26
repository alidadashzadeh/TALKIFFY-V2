import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import useCurrentUser from "../user/useCurrentUser";
import { useMessagesContext } from "@/contexts/MessagesContext";

function useSendMessage() {
	const queryClient = useQueryClient();
	const { currentUser } = useCurrentUser();
	const { currentConversationId, bottomRef } = useConversationContext();
	const { clearMessageState, setReplyTo } = useMessagesContext();

	const mutation = useMutation({
		mutationFn: async ({
			text,
			file,
			clientTempId,
			replyTo,
			conversationId,
		}) => {
			const formData = new FormData();
			const trimmedText = text?.trim() || "";

			if (trimmedText) {
				formData.append("content", trimmedText);
			}

			if (file) {
				formData.append("file", file);
			}

			if (replyTo) {
				formData.append("replyToId", replyTo._id);
			}

			formData.append("clientTempId", clientTempId);

			const { data } = await axiosInstance.post(
				`/messages/conversation/${conversationId}`,
				formData,
			);

			return data?.data?.newMessage;
		},

		onMutate: async ({ text, file, clientTempId, replyTo, conversationId }) => {
			if (!conversationId) return {};

			const queryKey = ["messages", conversationId];

			await queryClient.cancelQueries({ queryKey });

			const previousMessages = queryClient.getQueryData(queryKey) || [];
			const localUrl = file ? URL.createObjectURL(file) : null;
			const trimmedText = text?.trim() || "";

			const optimisticMessage = {
				_id: clientTempId,
				clientTempId,
				conversationId,
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

			setTimeout(() => {
				bottomRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 0);

			clearMessageState();

			return {
				queryKey,
				previousMessages,
				clientTempId,
				localUrl,
			};
		},

		onSuccess: (newMessage, _variables, context) => {
			if (!context?.queryKey || !context?.clientTempId || !newMessage) return;

			queryClient.setQueryData(context.queryKey, (old = []) => {
				const exists = old.some(
					(message) => message.clientTempId === context.clientTempId,
				);

				if (!exists) {
					return [
						...old,
						{
							...newMessage,
							clientTempId: context.clientTempId,
							optimistic: false,
						},
					];
				}

				return old.map((message) => {
					if (message.clientTempId !== context.clientTempId) {
						return message;
					}

					const optimisticAttachment = message.attachments?.[0];
					const serverAttachment = newMessage.attachments?.[0];

					return {
						...message,
						...newMessage,
						clientTempId: context.clientTempId,
						createdAt: message.createdAt,
						optimistic: false,
						attachments: serverAttachment
							? [
									{
										...serverAttachment,
										localUrl: optimisticAttachment?.localUrl,
									},
								]
							: [],
					};
				});
			});

			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
		},

		onError: (error, _variables, context) => {
			if (context?.localUrl) {
				URL.revokeObjectURL(context.localUrl);
			}

			if (context?.queryKey && Array.isArray(context.previousMessages)) {
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
				conversationId: currentConversationId,
			});
		},
	};
}

export default useSendMessage;
