// app/api/socket-token/route.ts
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ token }), {
		headers: { "Content-Type": "application/json" },
	});
}
