import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Message } from "@/types/chat";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	const userId = (await params).userId;

	const cookieStore = await cookies();
	const token = cookieStore.get("auth-token")?.value;

	if (!token) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		const response = await fetch(`${BACKEND_API_URL}/chats/${userId}`, {
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error("Backend API error:", {
				status: response.status,
				statusText: response.statusText,
				error,
			});
			return new NextResponse("Failed to fetch chat history", {
				status: response.status,
			});
		}

		const messages: Message[] = await response.json();
		return NextResponse.json({ messages });
	} catch (error) {
		console.error("Error fetching chat history:", error);
		return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
	}
}
