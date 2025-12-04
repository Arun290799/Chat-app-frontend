"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAvatarUrl } from "@/utils/avatar";

export default function Navbar() {
	const router = useRouter();
	const { isAuthenticated, user: currentUser, loading: authLoading, logout } = useAuth();

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login?redirect=/chat");
		}
	}, [isAuthenticated, authLoading, router]);

	const handleLogout = async () => {
		try {
			await logout();
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};
	if (!isAuthenticated || !currentUser) return null;

	return (
		<nav className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-4 lg:px-6">
				{/* Left side - Logo */}
				<div className="flex items-center gap-2">
					<div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-900/70">
						<span className="absolute inset-0 rounded-xl bg-white/10" />
						<span className="relative text-sm font-semibold text-slate-950">C</span>
					</div>
					<div className="leading-tight">
						<p className="text-sm font-semibold text-slate-50">ChatApp</p>
						<p className="text-[0.7rem] text-slate-400">Realtime conversations</p>
					</div>
				</div>

				{/* Right side - User and Logout */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-2.5 py-1.5 ring-1 ring-slate-700/80">
						<div className="relative">
							<img
								className="h-8 w-8 rounded-full ring-2 ring-slate-950"
								src={getAvatarUrl(currentUser)}
								alt={currentUser.name}
							/>
							<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
						</div>
						<div className="hidden text-left text-xs sm:block">
							<p className="font-medium text-slate-50">{currentUser.name}</p>
							<p className="text-[0.7rem] text-slate-400">{currentUser.email}</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-slate-600/80 transition hover:bg-red-500/90 hover:text-white hover:ring-red-400/70"
					>
						<span>Logout</span>
					</button>
				</div>
			</div>
		</nav>
	);
}
