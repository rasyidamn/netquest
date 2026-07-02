import {
	type RegisterInput,
	registerSchema,
} from "@/feature/auth/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { useRegister } from "@/feature/auth/hooks";
import FormInput from "@/components/form/FormInput";

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

			{/* Nama */}
			<FormInput
				label="Nama"
				registration={form.register("name")}
				error={form.formState.errors.name?.message}
				type="text"
				placeholder="Masukkan Nama"
			/>

			{/* Grup Password (Kiri-Kanan di layar lebar, Atas-Bawah di HP) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
				<FormInput
					label="Password"
					registration={form.register("password")}
					error={form.formState.errors.password?.message}
					type="password"
					placeholder="Masukkan Password"
				/>
				<FormInput
					label="Konfirmasi Password"
					registration={form.register("passwordConfirm")}
					error={form.formState.errors.passwordConfirm?.message}
					type="password"
					placeholder="Ulangi Password"
				/>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				className="btn btn-secondary w-full mt-2 shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-secondary),0.5)] hover:scale-[1.02] transition-all duration-300 border-0"
				disabled={isPending}
			>
				{isPending ? (
					<span className="loading loading-spinner" />
				) : (
					"Buat Identitas Pemain"
				)}
			</button>

			{/* Link ke login */}
			<p className="text-center text-sm mt-2 text-base-content/60 font-medium">
				Sudah punya akun?{" "}
				<Link
					to="/auth/login"
					className="text-secondary font-black hover:text-secondary-focus transition-colors"
				>
					Login
				</Link>
			</p>
		</form>
	);
}
