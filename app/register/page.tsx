"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { register } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			await register(name, email, password);
			router.push("/dashboard");
		} catch (err) {
			setError("Registration failed. Please try again.");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
			<div
				className={`bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-500 ease-out ${
					mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
				}`}
			>
				<div className={`transition-transform duration-700 ${mounted ? "scale-100" : "scale-95"}`}>
					<h1 className="text-3xl font-bold mb-2 text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						Create Account
					</h1>
					<p className="text-gray-500 text-center mb-6">Join our community today</p>

					{error && (
						<div
							className={`mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center transition-all duration-300 ${
								error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
							}`}
						>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div
							className={`transition-all duration-300 ease-out delay-75 ${
								mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
							}`}
						>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
								placeholder="John Doe"
								required
							/>
						</div>

						<div
							className={`transition-all duration-300 ease-out delay-100 ${
								mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
							}`}
						>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
								placeholder="your@email.com"
								required
							/>
						</div>

						<div
							className={`transition-all duration-300 ease-out delay-150 ${
								mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
							}`}
						>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
								placeholder="••••••••"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
								isSubmitting
									? "bg-blue-400 cursor-not-allowed"
									: "bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
							}`}
						>
							{isSubmitting ? "Creating account..." : "Sign Up"}
						</button>
					</form>

					<div
						className={`mt-6 text-center transition-all duration-300 delay-200 ${
							mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
						}`}
					>
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
