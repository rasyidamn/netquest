import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Hash, User, Shield, KeyRound } from "lucide-react";
import { CreateUserSchema, type CreateUserType } from "@/feature/user/schema/user.schema";

interface CreateUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: CreateUserType) => void;
	isPending?: boolean;
}

export function CreateUserModal({ isOpen, onClose, onSave, isPending }: CreateUserModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<CreateUserType>({
		resolver: zodResolver(CreateUserSchema),
		defaultValues: { role: "MAHASISWA" },
	});

	const nimValue = watch("nim");

	useEffect(() => {
		if (isOpen) reset({ role: "MAHASISWA", nim: "", name: "", password: "" });
	}, [isOpen, reset]);

	if (!isOpen) return null;

	return (
		<div className="modal modal-open bg-base-300/40 backdrop-blur-sm">
			<div className="modal-box max-w-lg p-0 overflow-hidden bg-base-100 flex flex-col max-h-[90vh] rounded-3xl shadow-2xl border border-base-200 animate-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="p-6 pb-5 border-b border-base-200/50 bg-gradient-to-br from-success/10 to-base-100 shrink-0">
					<h3 className="text-xl font-black flex items-center gap-3">
						<div className="p-2 bg-success/10 rounded-xl">
							<UserPlus className="w-5 h-5 text-success" />
						</div>
						Tambah Pengguna Baru
					</h3>
					<p className="text-sm text-base-content/60 mt-2 font-medium ml-[3.25rem]">
						Isi data pengguna. Password default adalah NIM jika tidak diisi.
					</p>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto custom-scrollbar">
					<form id="create-user-form" onSubmit={handleSubmit(onSave)} className="space-y-5">
						{/* NIM */}
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<Hash className="w-4 h-4 text-base-content/40" />
									NIM / Username
								</span>
							</label>
							<input
								type="text"
								{...register("nim")}
								className={`input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 ${errors.nim ? "input-error" : "focus:input-primary"}`}
								placeholder="Contoh: 2021001001"
							/>
							{errors.nim && <span className="text-error text-xs mt-1">{errors.nim.message}</span>}
						</div>

						{/* Nama */}
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<User className="w-4 h-4 text-base-content/40" />
									Nama Lengkap
								</span>
							</label>
							<input
								type="text"
								{...register("name")}
								className={`input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 ${errors.name ? "input-error" : "focus:input-primary"}`}
								placeholder="Masukkan nama lengkap..."
							/>
							{errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
						</div>

						{/* Role */}
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<Shield className="w-4 h-4 text-base-content/40" />
									Role (Peran)
								</span>
							</label>
							<select
								{...register("role")}
								className="select select-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 font-medium"
							>
								<option value="MAHASISWA">Mahasiswa</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>

						{/* Password (opsional) */}
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<KeyRound className="w-4 h-4 text-base-content/40" />
									Password
									<span className="badge badge-ghost badge-sm">Opsional</span>
								</span>
							</label>
							<input
								type="password"
								{...register("password")}
								className="input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:input-primary"
								placeholder={`Default: ${nimValue || "NIM"}`}
							/>
							<span className="label-text-alt mt-1 text-base-content/50">
								Kosongkan untuk menggunakan NIM sebagai password default.
							</span>
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className="p-5 border-t border-base-200/50 bg-base-200/30 shrink-0 flex justify-end gap-3">
					<button type="button" className="btn btn-ghost rounded-xl font-bold" onClick={onClose} disabled={isPending}>
						Batal
					</button>
					<button
						type="submit"
						form="create-user-form"
						className="btn btn-success rounded-xl font-bold px-6 shadow-md shadow-success/20"
						disabled={isPending}
					>
						{isPending ? <span className="loading loading-spinner loading-sm"></span> : "Tambah Pengguna"}
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop bg-transparent" onClick={onClose}>
				<button type="button">close</button>
			</form>
		</div>
	);
}
