import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConversationContext } from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import useCurrentUser from "../user/useCurrentUser ";

function useSendMessage() {
	const queryClient = useQueryClient();
	const { data: currentUser } = useCurrentUser();
	const { currentConversationId } = useConversationContext();
	const { socket } = useSocketContext();

	const mutation = useMutation({
		mutationFn: async ({ text, file }) => {
			const formData = new FormData();

			if (text?.trim()) {
				formData.append("content", text.trim());
			}

			if (file) {
				formData.append("file", file);
			}

			const { data } = await axiosInstance.post(
				`/messages/conversation/${currentConversationId}`,
				formData,
			);

			return data?.data?.newMessage;
		},

		onMutate: async ({ text, file }) => {
			if (!currentConversationId) return {};

			const queryKey = ["messages", currentConversationId];

			await queryClient.cancelQueries({ queryKey });

			const previousMessages = queryClient.getQueryData(queryKey) || [];

			const attachmentType = file?.type?.startsWith("image/")
				? "image"
				: file?.type?.startsWith("video/")
					? "video"
					: file?.type?.startsWith("audio/")
						? "audio"
						: file
							? "file"
							: null;

			const optimisticMessage = {
				_id: `temp-${Date.now()}`,
				conversationId: currentConversationId,
				senderId: {
					_id: currentUser?._id,
					username: currentUser?.username,
					avatar: currentUser?.avatar,
				},
				type: attachmentType || "text",
				content: text?.trim() || "",
				attachments: file
					? [
							{
								type: attachmentType,
								url: URL.createObjectURL(file),
								publicId: "",
								fileName: file.name,
								mimeType: file.type,
								size: file.size,
							},
						]
					: [],
				replyTo: null,
				reactions: [],
				readBy: [],
				deliveredTo: [],
				isEdited: false,
				isDeleted: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
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
