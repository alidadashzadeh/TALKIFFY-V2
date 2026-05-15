import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Logo from "@/components/ui/Logo.jsx";
import useSignup from "../hooks/auth/useSignup.js";

function SignupPage() {
	const { loading, signup } = useSignup();
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const password = watch("password");

	const onSubmit = async (data) => {
		signup(data);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground">
			<div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl sm:p-8">
				<div className="mb-8 flex flex-col items-center text-center">
					<div className="mb-4 flex items-center gap-3">
						<div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 p-2">
							<Logo size="w-9" />
						</div>

						<h1 className="text-3xl font-bold tracking-tight">Talkiffy</h1>
					</div>

					<p className="text-sm text-muted-foreground">
						Create your account and start clean conversations.
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>

						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							disabled={loading}
							aria-invalid={!!errors.email}
							className={
								errors.email
									? "border-destructive focus-visible:ring-destructive"
									: ""
							}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Please enter a valid email address",
								},
							})}
						/>

						{errors?.email?.message && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>

						<Input
							id="username"
							type="text"
							placeholder="Choose a username"
							disabled={loading}
							aria-invalid={!!errors.username}
							className={
								errors.username
									? "border-destructive focus-visible:ring-destructive"
									: ""
							}
							{...register("username", {
								required: "Username is required",
								maxLength: {
									value: 20,
									message: "Username must be 20 characters or less",
								},
							})}
						/>

						{errors?.username?.message && (
							<p className="text-sm text-destructive">
								{errors.username.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>

						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Create a password"
								disabled={loading}
								aria-invalid={!!errors.password}
								className={[
									"pr-10",
									errors.password
										? "border-destructive focus-visible:ring-destructive"
										: "",
								].join(" ")}
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters long",
									},
								})}
							/>

							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>

						{errors?.password?.message && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="passwordConfirm">Confirm Password</Label>

						<div className="relative">
							<Input
								id="passwordConfirm"
								type={showPasswordConfirm ? "text" : "password"}
								placeholder="Confirm your password"
								disabled={loading}
								aria-invalid={!!errors.passwordConfirm}
								className={[
									"pr-10",
									errors.passwordConfirm
										? "border-destructive focus-visible:ring-destructive"
										: "",
								].join(" ")}
								{...register("passwordConfirm", {
									required: "Confirm password is required",
									validate: (value) =>
										value === password || "Passwords do not match",
								})}
							/>

							<button
								type="button"
								onClick={() => setShowPasswordConfirm((prev) => !prev)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
							>
								{showPasswordConfirm ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>

						{errors?.passwordConfirm?.message && (
							<p className="text-sm text-destructive">
								{errors.passwordConfirm.message}
							</p>
						)}
					</div>

					<Button type="submit" disabled={loading} className="h-11 w-full">
						{loading ? "Creating account..." : "Create account"}
					</Button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

export default SignupPage;
