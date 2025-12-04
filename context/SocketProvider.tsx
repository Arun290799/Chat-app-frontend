"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, initializeSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";

interface SocketContextType {
	socket: typeof Socket | null;
	isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
	const [socket, setSocket] = useState<typeof Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const { user } = useAuth();
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			if (!user) return;

			try {
				const res = await fetch(`/api/getToken`, {
					headers: { "Content-Type": "application/json" },
					credentials: "include", // send cookies
				});
				if (res.ok) {
					const tokenData = await res.json();
					setToken(tokenData.token);
				} else {
					setToken(null);
				}
			} catch (error) {
				console.error("Auth check failed", error);
				setToken(null);
			}
		};

		fetchToken();
	}, [user]);

	useEffect(() => {
		let mounted = true;

		const connectSocket = async () => {
			try {
				// Get token from cookies
				if (!token) {
					console.warn("No auth token found in cookies");
					return;
				}

				const socket = await initializeSocket(token.toString());

				if (!mounted) {
					socket.disconnect();
					return;
				}

				const onConnect = () => setIsConnected(true);
				const onDisconnect = () => setIsConnected(false);

				socket.on("connect", onConnect);
				socket.on("disconnect", onDisconnect);

				setSocket(socket);
				setIsConnected(socket.connected);

				return () => {
					socket.off("connect", onConnect);
					socket.off("disconnect", onDisconnect);
					socket.disconnect();
				};
			} catch (error) {
				console.error("Socket connection error:", error);
			}
		};

		connectSocket();

		return () => {
			mounted = false;
			if (socket) {
				socket.disconnect();
				setIsConnected(false);
			}
		};
	}, [user?._id, token]); // Reconnect when user changes

	return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}
