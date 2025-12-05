"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Message } from "@/types/chat";
import UserList from "@/components/chat/UserList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/chat/SearchBar";

export default function ChatPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { isAuthenticated, user: currentUser, loading: authLoading } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [activeUser, setActiveUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
	const { socket, isConnected, emit, on } = useSocket();

	// Handle initial load and authentication
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login?redirect=/chat");
		}
	}, [isAuthenticated, authLoading, router]);

	const fetchMessages = useCallback(async () => {
		if (!isAuthenticated || !activeUser?._id || !currentUser?._id) return;
		try {
			const response = await fetch(`/api/proxy?endpoint=/messages/${activeUser._id}`, {
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
			if (!response.ok) throw new Error("Failed to fetch messages");
			const data = await response.json();
			const chatKey = [currentUser._id, activeUser._id].sort().join("-");
			setMessages((prev) => ({ ...prev, [chatKey]: data.data || [] }));
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages. Please try again later.");
		}
	}, [activeUser?._id, currentUser?._id, isAuthenticated]);

	// Fetch users from API
	const fetchUsers = useCallback(async () => {
		if (!isAuthenticated) return;

		try {
			const response = await fetch("/api/proxy?endpoint=/users/list", {
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) throw new Error("Failed to fetch users");

			const data = await response.json();
			setUsers(data.data || []);
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("Failed to load users. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	// Set active user from URL params
	useEffect(() => {
		if (users.length > 0 && searchParams.get("userId")) {
			const userId = searchParams.get("userId");
			const user = users.find((u) => u._id === userId);
			if (user) setActiveUser(user);
		}
	}, [users, searchParams]);

	// Fetch messages when active user changes
	useEffect(() => {
		if (authLoading) return;
		if (isAuthenticated && currentUser?._id && activeUser?._id) {
			fetchMessages();
		}
	}, [isAuthenticated, currentUser?._id, activeUser?._id,authLoading]);
	

	// Handle user selection
	const handleUserSelect = useCallback(
		(user: User) => {
			setActiveUser(user);
			router.push(`/chat?userId=${user._id}`, { scroll: false });
		},
		[router]
	);

	// Handle sending messages
	const handleSendMessage = useCallback(
		async (content: string) => {
			if (!activeUser || !currentUser || !isConnected) return;
			try {
				const response = await fetch(`/api/proxy?endpoint=/messages/send`, {
					method: "POST",
					body: JSON.stringify({ receiverId: activeUser._id, content }),
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				});
				if (!response.ok) throw new Error("Failed to send message");
				const data = await response.json();
				console.log("message sent", data);
				const chatKey = [currentUser._id, activeUser._id].sort().join("-");
				// Stop typing when message is sent
				await emit("typing:stop", {
					receiverId: activeUser._id,
				});
			} catch (error) {
				console.error("Error sending message:", error);
			}
		},
		[activeUser, currentUser, emit, isConnected]
	);

	// Handle typing events
	const handleTypingStart = useCallback(() => {
		if (!activeUser || !currentUser || !isConnected) return;
		emit("typing:start", {
			receiverId: activeUser._id,
		});
	}, [activeUser, currentUser, emit, isConnected]);

	const handleTypingStop = useCallback(() => {
		if (!activeUser || !currentUser || !isConnected) return;
		emit("typing:stop", {
			receiverId: activeUser._id,
		});
	}, [activeUser, currentUser, emit, isConnected]);

	// Handle incoming messages
	useEffect(() => {
		if (!socket || !currentUser) return;

		const handleNewMessage = (message: Message) => {
			console.log("new message", message);
			const chatKey = [message.senderId, currentUser._id].sort().join("-");
			setMessages((prev) => ({
				...prev,
				[chatKey]: [...(prev[chatKey] || []), message],
			}));
		};

		const handleOnlineUsers = (onlineUserIds: string[]) => {
			setUsers((prevUsers) =>
				prevUsers.map((user) => ({
					...user,
					status: onlineUserIds.includes(user._id) ? "online" : "offline",
				}))
			);
		};

		const handleUserOffline = (user: Record<string, string>) => {
			setUsers((prevUsers) =>
				prevUsers.map((u) => ({
					...u,
					status: user.userId === u._id ? "offline" : u.status,
				}))
			);
		};

		const handleOnlineUser = (user: Record<string, string>) => {
			setUsers((prevUsers) =>
				prevUsers.map((u) => ({
					...u,
					status: user.userId === u._id ? "online" : u.status,
				}))
			);
		};

		const handleMessageSent = (message: Message) => {
			console.log("message sent", message);
			console.log("currentUser", currentUser);
			const chatKey = [currentUser._id, message.receiverId].sort().join("-");
			console.log("chatKey", chatKey);
			console.log("message", message);
			setMessages((prev) => ({
				...prev,
				[chatKey]: [...(prev[chatKey] || []), message],
			}));
		};

		const handleTypingStart = (data: { userId: string }) => {
			setTypingUsers((prev) => new Set(prev).add(data.userId));
		};

		const handleTypingStop = (data: { userId: string }) => {
			setTypingUsers((prev) => {
				const next = new Set(prev);
				next.delete(data.userId);
				return next;
			});
		};

		const unsubscribeMessage = on("message:new", handleNewMessage);
		const unsubscribeOnlineUsers = on("users:online", handleOnlineUsers);
		const unsubscribeUserOffline = on("user:offline", handleUserOffline);
		const unsubscribeUserOnline = on("user:online", handleOnlineUser);
		const unsubscribeMessageSent = on("message:sent", handleMessageSent);
		const unsubscribeTypingStart = on("typing:start", handleTypingStart);
		const unsubscribeTypingStop = on("typing:stop", handleTypingStop);

		return () => {
			unsubscribeMessage?.();
			unsubscribeOnlineUsers?.();
			unsubscribeUserOffline?.();
			unsubscribeUserOnline?.();
			unsubscribeMessageSent?.();
			unsubscribeTypingStart?.();
			unsubscribeTypingStop?.();
		};
	}, [socket, currentUser, on]);

	// Initial data fetch
	useEffect(() => {
		if (isAuthenticated) {
			fetchUsers();
		}
	}, [isAuthenticated, fetchUsers]);

	const filteredUsers = useMemo(() => {
		if (!search.trim()) return users;
		const query = search.toLowerCase();
		return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
	}, [users, search]);

	if (authLoading || isLoading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900">
				<div className="flex flex-col items-center gap-4">
					<div className="h-12 w-12 rounded-full border-4 border-sky-400/60 border-t-transparent animate-spin" />
					<p className="text-sm text-slate-100/80 tracking-wide">Preparing your chats...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen bg-slate-950">
				<div className="max-w-md w-full mx-4 rounded-2xl border border-red-500/30 bg-red-950/40 px-6 py-5 shadow-xl shadow-red-900/40">
					<p className="text-sm font-medium text-red-100 mb-2">Something went wrong</p>
					<p className="text-sm text-red-200/80">{error}</p>
				</div>
			</div>
		);
	}

	const chatId = activeUser && currentUser ? [currentUser._id, activeUser._id].sort().join("-") : null;

	return (
		<div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900" style={{ height: 'calc(100vh - 57px)' }}>
			{/* background orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
				<div className="absolute -left-24 top-[-6rem] h-64 w-64 rounded-full bg-sky-500/40 blur-3xl" />
				<div className="absolute right-[-4rem] bottom-[-4rem] h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
			</div>

			<div className="relative mx-auto flex h-full max-w-6xl gap-4 px-3 py-4 sm:px-4 lg:px-6">
				{/* Sidebar */}
				<aside className="group flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.8)] transition-transform duration-300">
					<div className="border-b border-slate-700/60 px-4 py-3">
						<div className="flex items-center justify-between gap-2">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Messages</p>
								<h2 className="mt-1 text-lg font-semibold text-slate-50">Chats</h2>
							</div>
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40">
								<span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
							</div>
						</div>
						<div className="mt-3">
							<SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
						</div>
					</div>

					<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-900/60 scrollbar-thumb-slate-600/60 hover:scrollbar-thumb-slate-500/70">
						<UserList
							users={filteredUsers}
							currentUserId={currentUser?._id || ""}
							onUserSelect={handleUserSelect}
							activeUserId={activeUser?._id}
						/>
						{filteredUsers.length === 0 && (
							<div className="px-4 py-6 text-center text-xs text-slate-400">
								No users match <span className="font-medium text-slate-200">{search}</span>
							</div>
						)}
					</div>
				</aside>

				{/* Main chat area */}
				<section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-slate-700/70 bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.85)] overflow-hidden">
					{activeUser ? (
						<ChatWindow
							currentUser={currentUser!}
							recipient={activeUser}
							messages={chatId ? messages[chatId] || [] : []}
							onSendMessage={handleSendMessage}
							isLoading={false}
							isConnected={isConnected}
							isTyping={typingUsers.has(activeUser._id)}
							onTypingStart={handleTypingStart}
							onTypingStop={handleTypingStop}
						/>
					) : (
						<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 ring-1 ring-slate-600/80 shadow-lg shadow-slate-900/70">
								<span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 text-slate-950">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/40" />
									<span className="relative text-lg font-semibold">💬</span>
								</span>
							</div>
							<div>
								<p className="text-base font-medium text-slate-50">Welcome to your inbox</p>
								<p className="mt-1 text-sm text-slate-400">
									Choose a conversation from the list to start messaging in real time.
								</p>
							</div>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
