"use client";

import { User } from "@/types/chat";
import OnlineStatus from "./OnlineStatus";
import { getAvatarUrl } from "@/utils/avatar";
interface UserItemProps {
	user: User;
	isActive: boolean;
	onClick: () => void;
}

export default function UserItem({ user, isActive, onClick }: UserItemProps) {
	return (
		<div
			onClick={onClick}
			className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 ${
				isActive
					? "bg-slate-800/80 ring-1 ring-sky-400/60 shadow-sm shadow-sky-900/40"
					: "hover:bg-slate-800/60"
			}`}
		>
			<div className="relative">
				<img src={getAvatarUrl(user)} alt={user.name} className="h-10 w-10 rounded-full ring-2 ring-slate-900" />
				<OnlineStatus isOnline={user.status === "online"} />
			</div>
			<div className="min-w-0">
				<h3 className="truncate text-sm font-medium text-slate-50">{user.name}</h3>
				<p className="text-xs text-slate-400">
					{user.status === "online" ? "Online" : "Offline"}
				</p>
			</div>
		</div>
	);
}
