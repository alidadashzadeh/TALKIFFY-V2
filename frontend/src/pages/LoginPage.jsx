import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useLogin from "./../hooks/useLogin.js";

function Login() {
	const { loading, login } = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		login(data);
	};

	return (
		<div className="flex justify-center items-center h-full bg-background__primary text-text__primary">
			<div className="flex flex-col gap-4 items-center justify-center p-8 rounded-xl bg-background__secondary w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] max-w-[400px]">
				{/* Logo */}
				<div className="flex gap-2 justify-center items-center">
					<div className="w-20">
						<img src="logo-2.gif" alt="Talkiffy logo" />
					</div>
					<p className="text-4xl">TALKIFFY</p>
				</div>

				<p className="text-xl">Login to your account</p>

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
							})}
						/>
						{errors?.email?.message && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
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
							})}
						/>
						{errors?.password?.message && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>

					<a href="#" className="text-sm hover:underline hover:text-blue-600">
						Forgot password?
					</a>

					<Button type="submit" disabled={loading} className="w-full">
						{loading ? "Logging in..." : "Login"}
					</Button>
				</form>

				<Link
					to="/signup"
					className="text-sm hover:underline hover:text-blue-600"
				>
					Don&apos;t have an account? signup
				</Link>
			</div>
		</div>
	);
}

export default Login;
