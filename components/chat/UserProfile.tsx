"use client";

import { User } from "../../types/chat";
import { getAvatarUrl } from "@/utils/avatar";
interface UserProfileProps {
	user: User;
	showStatus?: boolean;
}
export default function UserProfile({ user, showStatus = false }: UserProfileProps) {
	return (
		<div className="flex items-center gap-3">
			<div className="relative">
				<img src={getAvatarUrl(user)} alt={user.name} className="h-10 w-10 rounded-full ring-2 ring-slate-900" />
				{showStatus && (
					<span
						className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
							user.status === "online" ? "bg-emerald-400" : "bg-slate-500"
						}`}
					></span>
				)}
			</div>
			<div>
				<h3 className="text-sm font-medium text-slate-50">{user.name}</h3>
				{showStatus && (
					<p className="text-xs text-slate-400">
						{user.status === "online" ? "Online" : "Offline"}
					</p>
				)}
			</div>
		</div>
	);
}
