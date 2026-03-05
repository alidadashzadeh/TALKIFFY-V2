import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useSignup from "../hooks/useSignup.js";

function SignupPage() {
	const { loading, signup } = useSignup();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const password = watch("password");

	const onSubmit = async (data) => {
		console.log(data);
		signup(data);
	};

	return (
		<div className="flex justify-center items-center w-full h-[100vh] bg-background__primary text-text__primary">
			<div className="flex flex-col gap-4 items-center justify-center p-8 rounded-xl bg-background__secondary w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] max-w-[400px]">
				<div className="flex gap-4 justify-center items-center">
					<div className="w-20">
						<img src="logo-2.gif" alt="Talkiffy logo" />
					</div>
					<div className="text-4xl">TALKIFFY</div>
				</div>

				<h1 className="text-xl">Create new account</h1>

				<form
					className="flex flex-col gap-4 w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					{/* Email */}
					<div className="grid gap-2">
						<Label htmlFor="email" className="text-text__accent">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							disabled={loading}
							aria-invalid={!!errors.email}
							className={[
								"bg-transparent text-text__primary",
								errors.email ? "border-red-500 focus-visible:ring-red-500" : "",
							].join(" ")}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Please enter a valid email address",
								},
							})}
						/>
						{errors?.email?.message && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>

					{/* Username */}
					<div className="grid gap-2">
						<Label htmlFor="username" className="text-text__accent">
							Username
						</Label>
						<Input
							id="username"
							type="text"
							disabled={loading}
							aria-invalid={!!errors.username}
							className={[
								"bg-transparent text-text__primary",
								errors.username
									? "border-red-500 focus-visible:ring-red-500"
									: "",
							].join(" ")}
							{...register("username", {
								required: "Username is required",
								maxLength: {
									value: 20,
									message: "Username must be 20 characters or less",
								},
							})}
						/>
						{errors?.username?.message && (
							<p className="text-sm text-red-500">{errors.username.message}</p>
						)}
					</div>

					{/* Password */}
					<div className="grid gap-2">
						<Label htmlFor="password" className="text-text__accent">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							disabled={loading}
							aria-invalid={!!errors.password}
							className={[
								"bg-transparent text-text__primary",
								errors.password
									? "border-red-500 focus-visible:ring-red-500"
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
						{errors?.password?.message && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>

					{/* Confirm Password */}
					<div className="grid gap-2">
						<Label htmlFor="passwordConfirm" className="text-text__accent">
							Confirm Password
						</Label>
						<Input
							id="passwordConfirm"
							type="password"
							disabled={loading}
							aria-invalid={!!errors.passwordConfirm}
							className={[
								"bg-transparent text-text__primary",
								errors.passwordConfirm
									? "border-red-500 focus-visible:ring-red-500"
									: "",
							].join(" ")}
							{...register("passwordConfirm", {
								required: "Confirm password is required",
								validate: (value) =>
									value === password || "Passwords do not match",
							})}
						/>
						{errors?.passwordConfirm?.message && (
							<p className="text-sm text-red-500">
								{errors.passwordConfirm.message}
							</p>
						)}
					</div>

					<Button type="submit" disabled={loading} className="w-full">
						{loading ? "Signing up..." : "Sign up"}
					</Button>
				</form>

				<Link
					to="/login"
					className="text-sm hover:underline hover:text-blue-600"
				>
					Already have an account? Login
				</Link>
			</div>
		</div>
	);
}

export default SignupPage;
