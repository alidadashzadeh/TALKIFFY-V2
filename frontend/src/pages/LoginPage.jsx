import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useLogin from "../hooks/auth/useLogin.js";
import Logo from "@/components/ui/Logo.jsx";

function Login() {
	const { loading, login } = useLogin();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		login(data);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
			<div className="w-full max-w-md rounded-3xl border-muted border bg-card p-6 shadow-xl sm:p-8">
				<div className="mb-8 flex flex-col items-center text-center">
					<div className="mb-4 flex items-center gap-3">
						<div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 p-2">
							<Logo size="w-9" />
						</div>

						<h1 className="text-3xl font-bold tracking-tight">Talkiffy</h1>
					</div>

					<p className="text-sm text-muted-foreground">
						Welcome back. Sign in to continue your conversations.
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
					{/* Email */}
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
							})}
						/>

						{errors?.email?.message && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					{/* Password */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>

							<a
								href="#"
								className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
							>
								Forgot password?
							</a>
						</div>

						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
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

					<Button type="submit" disabled={loading} className="h-11 w-full">
						{loading ? "Signing in..." : "Sign in"}
					</Button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						to="/signup"
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
