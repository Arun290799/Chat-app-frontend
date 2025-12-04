"use client";

import { useRef, useEffect } from "react";
import { User, Message } from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserProfile from "./UserProfile";

interface ChatWindowProps {
	currentUser: User;
	recipient: User;
	messages: Message[];
	onSendMessage: (content: string) => void;
	isLoading: boolean;
	isConnected: boolean;
	isTyping?: boolean;
	onTypingStart?: () => void;
	onTypingStop?: () => void;
}

export default function ChatWindow({
	currentUser,
	recipient,
	messages,
	onSendMessage,
	isLoading,
	isConnected,
	isTyping = false,
	onTypingStart,
	onTypingStop,
}: ChatWindowProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	// Auto-scroll to bottom when messages or typing status changes
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-b border-slate-800/80 bg-slate-900/80 px-4 py-3">
				<div className="flex items-center justify-between gap-3">
					<UserProfile user={recipient} showStatus />
					<div className="flex items-center gap-3 text-xs text-slate-400">
						<span
							className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-offset-0 ${
								isConnected
									? "bg-emerald-500/10 text-emerald-200 ring-emerald-400/40"
									: "bg-amber-500/10 text-amber-100 ring-amber-400/40"
							}`}
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${
									isConnected ? "bg-emerald-400" : "bg-amber-400"
								}`}
							/>
							<span>{isConnected ? "Connected" : "Reconnecting..."}</span>
						</span>
					</div>
				</div>
			</header>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950/40 via-slate-900/70 to-slate-950/90 px-4 py-4 scrollbar-thin scrollbar-track-slate-950/60 scrollbar-thumb-slate-700/70 hover:scrollbar-thumb-slate-500/80">
				{isLoading ? (
					<div className="flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-400/80 border-t-transparent" />
							<p className="text-xs text-slate-400">Loading conversation...</p>
						</div>
					</div>
				) : (
					<>
						<MessageList messages={messages} currentUserId={currentUser._id} />
						{isTyping && (
							<div className="flex justify-start mt-2">
								<div className="max-w-xs rounded-2xl px-3.5 py-2.5 bg-slate-800/90 border border-slate-700/70 rounded-bl-sm">
									<div className="flex items-center gap-1">
										<span className="text-sm text-slate-400 italic">
											{recipient.name} is typing
										</span>
										<div className="flex gap-1 ml-1">
											<span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
											<span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
											<span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
										</div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			{/* Input */}
			<footer className="border-t border-slate-800/80 bg-slate-900/90 px-4 py-3">
				<MessageInput 
					onSendMessage={onSendMessage} 
					isConnected={isConnected} 
					disabled={isLoading}
					onTypingStart={onTypingStart}
					onTypingStop={onTypingStop}
				/>
			</footer>
		</div>
	);
}
