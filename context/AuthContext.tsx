"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/chat";
import { getCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const apiUrl = "/api/proxy?endpoint=";
	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const response = await fetch(`${apiUrl}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include", // Important for cookies
			});
			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.message || "Login failed");
			}

			const userData = await response.json();
			setUser(userData.data);
		} finally {
			setLoading(false);
		}
	};

	const register = async (name: string, email: string, password: string) => {
		setLoading(true);
		try {
			const response = await fetch(`${apiUrl}/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
				credentials: "include",
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.message || "Registration failed");
			}

			const userData = await response.json();
			setUser(userData.data);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await fetch(`${apiUrl}/auth/logout`, {
				method: "GET",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Clear client-side state
			setUser(null);
			// Remove any client-side cookies
			deleteCookie("auth-token");
			router.push("/login");
		}
	};

	// Check auth status on mount
	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${apiUrl}/auth/me`, {
					headers: { "Content-Type": "application/json" },
					credentials: "include", // Important for cookies
				});

				if (res.ok) {
					const userData = await res.json();
					setUser(userData.data);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Auth check failed", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		if (!user) checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
