export interface User {
	_id: string;
	name: string;
	email: string;
	avatar: string;
	status: "online" | "offline";
	lastSeen?: string;
}

export interface Message {
	_id: string;
	content: string;
	senderId: string;
	receiverId: string;
	timestamp: string;
	status: "sending" | "sent" | "delivered" | "read" | "failed" | "error";
	read?: boolean;
}
