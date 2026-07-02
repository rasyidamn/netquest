import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import FormInput from "@/components/form/FormInput";
import {
	loginSchema,
	type LoginInput,
} from "../../../../feature/auth/schema/auth.schema";
import { useLogin } from "@/feature/auth/hooks";

export function LoginForm() {
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
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-3 sm:gap-4"
		>
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

			{/* Submit Button */}
			<button
				type="submit"
				className="btn btn-primary w-full mt-2 shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] hover:scale-[1.02] transition-all duration-300 border-0"
				disabled={isPending}
			>
				{isPending ? (
					<span className="loading loading-spinner" />
				) : (
					"Login"
				)}
			</button>

			{/* Link ke register */}
			<p className="text-center text-sm mt-2 text-base-content/60 font-medium">
				Belum terdaftar?{" "}
				<Link
					to="/auth/register"
					className="text-primary font-black hover:text-primary-focus transition-colors"
				>
					Daftar Sekarang
				</Link>
			</p>
		</form>
	);
}
