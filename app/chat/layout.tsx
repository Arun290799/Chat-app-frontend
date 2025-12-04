"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/chat";

export default function ChatLayout({ children }: { children: ReactNode }) {
	const { user: currentUser, loading } = useAuth();
	const router = useRouter();

	// Redirect if not authenticated
	useEffect(() => {
		if (!loading && !currentUser) {
			router.replace("/login?redirect=/chat");
		}
	}, [loading, currentUser, router]);

	// Show loading state while checking auth
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// Don't render children if not authenticated (redirect is in progress)
	if (!currentUser) {
		return null;
	}

	return (
		<div className="flex bg-gray-100">
			<main className="flex-1 flex flex-col bg-white">{children}</main>
		</div>
	);
}
