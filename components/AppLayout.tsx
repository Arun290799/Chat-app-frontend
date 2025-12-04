"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAuthPage = pathname === "/login" || pathname === "/register";
	return (
		<div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
			{!isAuthPage && <Navbar />}
			<main className="flex-1">{children}</main>
		</div>
	);
}
