import { useLogin } from "@/hooks/auth/useLogin";
import { type LoginInput, loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import FormInput from "./FormInput";

export default function LoginForm() {
	const { mutate: login, isPending } = useLogin();
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			nim: "",
			password: "",
		},
	});
	const onSubmit = (values: LoginInput) => {
		login(values);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0.5 w-full">
			{/* NIM */}
			<FormInput
				label="NIM"
				registration={form.register("nim")}
				error={form.formState.errors.nim?.message}
				type="text"
				placeholder="Masukkan NIM"
			/>

			{/* Password */}
			<FormInput
				label="Password"
				registration={form.register("password")}
				error={form.formState.errors.password?.message}
				type="password"
				placeholder="Masukkan Password"
			/>

			{/* Submit */}
			<button
				type="submit"
				className="btn btn-primary w-full"
				disabled={isPending}
			>
				{isPending ? (
					<span className="loading loading-spinner" />
				) : (
					"Masuk"
				)}
			</button>

			{/* Link ke register */}
			<p className="text-center text-sm mt-4">
				Belum punya akun?{" "}
				<Link to="/auth/register" className="link link-accent">
					Daftar
				</Link>
			</p>
		</form>
	);
}
