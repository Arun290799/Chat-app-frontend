import io from "socket.io-client";

let socket: any = null;

export const initializeSocket = (token: string): Promise<any> => {
	const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
	return new Promise((resolve, reject) => {
		if (socket && socket.connected) {
			return resolve(socket);
		}

		const newSocket = io(API_URL || "http://localhost:5000", {
			auth: { token },
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		newSocket.on("connect", () => {
			console.log("Socket connected");
			socket = newSocket;
			resolve(newSocket);
		});

		newSocket.on("connect_error", (error: any) => {
			console.error("Socket connection error:", error);
			reject(error);
		});
	});
};

export const getSocket = (): any | null => {
	return socket;
};

export const disconnectSocket = (): void => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
