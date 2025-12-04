"use client";

import { User } from "@/types/chat";
import UserItem from "./UserItem";

interface UserListProps {
	users: User[];
	currentUserId: string;
	activeUserId?: string | null;
	onUserSelect: (user: User) => void;
}

export default function UserList({ users, currentUserId, activeUserId, onUserSelect }: UserListProps) {
	return (
		<div className="divide-y divide-gray-100">
			{users
				.filter((user) => user._id !== currentUserId)
				.map((user, index) => (
					<UserItem
						key={`${user._id}-${index}`}
						user={user}
						isActive={user._id === activeUserId}
						onClick={() => onUserSelect(user)}
					/>
				))}
		</div>
	);
}
