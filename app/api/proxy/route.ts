// export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, "GET");
}
export async function POST(request: NextRequest) {
  return handleProxyRequest(request, "POST");
}
export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, "PUT");
}
export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, "DELETE");
}

async function handleProxyRequest(request: NextRequest, method: string) {
  const API_URL = process.env.BACKEND_API_URL;
  const endpoint = request.nextUrl.searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  const url = new URL(endpoint, API_URL);

  // Node.js runtime allows request.text() without breaking the stream
  const rawBody =
    method !== "GET" && method !== "HEAD" ? await request.text() : undefined;

  const headers = new Headers(request.headers);
  headers.set("Content-Type", "application/json");
  headers.delete("content-length");

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: rawBody,
    credentials: "include",
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
