"use client";

import { Message } from "@/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
	messages: Message[];
	currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<MessageItem key={message._id} message={message} isCurrentUser={message.senderId === currentUserId} />
			))}
		</div>
	);
}
