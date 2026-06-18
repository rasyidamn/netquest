import { useRegister } from "@/hooks/auth/useRegister";
import { type RegisterInput, registerSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import FormInput from "./FormInput";

export default function RegisterForm() {
	const { mutate: register, isPending } = useRegister();
	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			nim: "",
			name: "",
			password: "",
			passwordConfirm: "",
		},
	});
	const onSubmit = (values: RegisterInput) => {
		register(values);
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="w-full space-y-0.5"
		>
			{/* NIM */}
			<FormInput
				label="NIM"
				registration={form.register("nim")}
				error={form.formState.errors.nim?.message}
				type="text"
				placeholder="Masukkan NIM"
			/>

			{/* Nama */}
			<FormInput
				label="Nama"
				registration={form.register("name")}
				error={form.formState.errors.name?.message}
				type="text"
				placeholder="Masukkan Nama"
			/>

			{/* Password */}
			<FormInput
				label="Password"
				registration={form.register("password")}
				error={form.formState.errors.password?.message}
				type="password"
				placeholder="Masukkan Password"
			/>

			{/* Konfirmasi Password */}
			<FormInput
				label="Konfirmasi Password"
				registration={form.register("passwordConfirm")}
				error={form.formState.errors.passwordConfirm?.message}
				type="password"
				placeholder="Masukkan Ulang Password"
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
					"Daftar"
				)}
			</button>

			{/* Link ke login */}
			<p className="text-center text-sm mt-4">
				Sudah punya akun?{" "}
				<Link to="/auth/login" className="link link-accent">
					Masuk
				</Link>
			</p>
		</form>
	);
}
