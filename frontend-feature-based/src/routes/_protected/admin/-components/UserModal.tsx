import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Shield, Trophy, Hash } from "lucide-react";
import { UpdateUserSchema, type UpdateUserType } from "@/feature/user/schema/user.schema";

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: UpdateUserType) => void;
	initialData: any;
	isPending?: boolean;
}

export function UserModal({
	isOpen,
	onClose,
	onSave,
	initialData,
	isPending,
}: UserModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateUserType>({
		resolver: zodResolver(UpdateUserSchema),
	});

	useEffect(() => {
		if (isOpen) {
			reset({
				nim: initialData?.nim || "",
				name: initialData?.name || "",
				role: initialData?.role || "MAHASISWA",
				xp: initialData?.xp || 0,
			});
		}
	}, [isOpen, initialData, reset]);

	const onSubmit = (data: UpdateUserType) => {
		onSave(data);
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open bg-base-300/40 backdrop-blur-sm">
			<div className="modal-box max-w-lg p-0 overflow-hidden bg-base-100 flex flex-col max-h-[90vh] rounded-3xl shadow-2xl border border-base-200 animate-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="p-6 pb-5 border-b border-base-200/50 bg-gradient-to-br from-base-200/50 to-base-100 shrink-0">
					<h3 className="text-xl font-black flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-xl">
							<User className="w-5 h-5 text-primary" />
						</div>
						Edit Pengguna
					</h3>
					<p className="text-sm text-base-content/60 mt-2 font-medium ml-[3.25rem]">
						Ubah profil pengguna, peran, atau poin XP.
					</p>
				</div>

				{/* Body - Scrollable */}
				<div className="p-6 overflow-y-auto custom-scrollbar">
					<form
						id="user-form"
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-5"
					>
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
								className={`input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 transition-shadow focus:shadow-md focus:shadow-primary/10 ${errors.nim ? "input-error" : "focus:input-primary"}`}
								placeholder="Masukkan NIM..."
							/>
							{errors.nim && (
								<label className="label py-1">
									<span className="label-text-alt text-error font-medium">
										{errors.nim.message}
									</span>
								</label>
							)}
						</div>

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
								className={`input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 transition-shadow focus:shadow-md focus:shadow-primary/10 ${errors.name ? "input-error" : "focus:input-primary"}`}
								placeholder="Masukkan Nama Lengkap..."
							/>
							{errors.name && (
								<label className="label py-1">
									<span className="label-text-alt text-error font-medium">
										{errors.name.message}
									</span>
								</label>
							)}
						</div>

						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<Shield className="w-4 h-4 text-base-content/40" />
									Role (Peran)
								</span>
							</label>
							<select
								{...register("role")}
								className="select select-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 transition-shadow focus:shadow-md focus:shadow-primary/10 focus:select-primary font-medium"
							>
								<option value="MAHASISWA">Mahasiswa</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>

						<div className="form-control w-full">
							<label className="label">
								<span className="label-text font-bold flex items-center gap-2">
									<Trophy className="w-4 h-4 text-base-content/40" />
									Total XP
								</span>
							</label>
							<input
								type="number"
								{...register("xp", { valueAsNumber: true })}
								className={`input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 transition-shadow focus:shadow-md focus:shadow-warning/10 ${errors.xp ? "input-error" : "focus:input-warning text-warning font-black"}`}
								placeholder="Total XP..."
							/>
							{errors.xp && (
								<label className="label py-1">
									<span className="label-text-alt text-error font-medium">
										{errors.xp.message}
									</span>
								</label>
							)}
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className="p-5 border-t border-base-200/50 bg-base-200/30 shrink-0 flex justify-end gap-3">
					<button
						type="button"
						className="btn btn-ghost rounded-xl hover:bg-base-200 font-bold"
						onClick={onClose}
						disabled={isPending}
					>
						Batal
					</button>
					<button
						type="submit"
						form="user-form"
						className="btn btn-primary rounded-xl font-bold px-6 shadow-md shadow-primary/20"
						disabled={isPending}
					>
						{isPending ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							"Simpan Perubahan"
						)}
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop bg-transparent" onClick={onClose}>
				<button type="button">close</button>
			</form>
		</div>
	);
}
