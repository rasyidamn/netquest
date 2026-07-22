import { createFileRoute } from "@tanstack/react-router";
import {
	Users, Search, Edit, Trash2, Filter, ArrowUpDown, ArrowUp, ArrowDown,
	ChevronLeft, ChevronRight, UserPlus, BarChart2, KeyRound,
	GraduationCap, ShieldCheck, Zap, Activity,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import clsx from "clsx";

import { useUsers } from "@/feature/user/hooks/useUsers";
import { useUserStats } from "@/feature/user/hooks/useUserStats";
import { useCreateUser } from "@/feature/user/hooks/useCreateUser";
import { useResetPassword } from "@/feature/user/hooks/useResetPassword";
import { userApi } from "@/feature/user/api/userApi";
import { UserModal } from "./-components/UserModal";
import { CreateUserModal } from "./-components/CreateUserModal";
import { UserProgressModal } from "./-components/UserProgressModal";
import type { UserType, UpdateUserType, CreateUserType } from "@/feature/user/schema/user.schema";

export const Route = createFileRoute("/_protected/admin/users")({
	component: AdminUsersPage,
});

function StatCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	color: string;
}) {
	return (
		<div className="bg-base-100 rounded-2xl border border-base-200/50 p-5 flex items-center gap-4 shadow-sm">
			<div className={`p-3 rounded-xl ${color}`}>
				<Icon className="w-6 h-6" />
			</div>
			<div>
				<p className="text-2xl font-black text-base-content">{value}</p>
				<p className="text-sm text-base-content/60 font-medium">{label}</p>
			</div>
		</div>
	);
}

function AdminUsersPage() {
	const queryClient = useQueryClient();
	const { data: users = [], isLoading, isError } = useUsers();
	const { data: stats } = useUserStats();

	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "MAHASISWA">("ALL");

	// Modal states
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [progressUser, setProgressUser] = useState<UserType | null>(null);

	// Pagination & Sorting
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{ key: keyof UserType; direction: "asc" | "desc" } | null>(null);
	const itemsPerPage = 10;

	const updateUserMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserType }) => userApi.updateUser({ id, data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("Data pengguna berhasil diperbarui!");
			setIsEditModalOpen(false);
			setSelectedUser(null);
		},
		onError: (error: any) => toast.error(error.message),
	});

	const deleteUserMutation = useMutation({
		mutationFn: (id: string) => userApi.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
			toast.success("Pengguna berhasil dihapus!");
		},
		onError: (error: any) => toast.error(error.message),
	});

	const createUserMutation = useCreateUser();
	const resetPasswordMutation = useResetPassword();

	const handleEdit = (user: UserType) => { setSelectedUser(user); setIsEditModalOpen(true); };

	const handleDelete = (user: UserType) => {
		if (window.confirm(`Hapus pengguna "${user.name}"? Semua progresnya akan ikut terhapus.`)) {
			deleteUserMutation.mutate(user.id);
		}
	};

	const handleSave = (data: UpdateUserType) => {
		if (selectedUser) updateUserMutation.mutate({ id: selectedUser.id, data });
	};

	const handleCreate = (data: CreateUserType) => {
		createUserMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Pengguna baru berhasil ditambahkan!");
				setIsCreateModalOpen(false);
			},
			onError: (error: any) => toast.error(error.message),
		});
	};

	const handleResetPassword = (user: UserType) => {
		if (window.confirm(`Reset password "${user.name}" ke NIM-nya (${user.nim})?`)) {
			resetPasswordMutation.mutate(user.id, {
				onSuccess: () => toast.success(`Password berhasil direset ke NIM: ${user.nim}`),
				onError: (error: any) => toast.error(error.message),
			});
		}
	};

	const handleSort = (key: keyof UserType) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc";
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof UserType) => {
		if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />;
		return sortConfig.direction === "asc" ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />;
	};

	const filteredAndSortedUsers = useMemo(() => {
		let result = users.filter((user: UserType) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.nim.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
		if (sortConfig) {
			result.sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];
				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return result;
	}, [users, searchQuery, roleFilter, sortConfig]);

	const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / itemsPerPage));
	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredAndSortedUsers, currentPage]);

	useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter]);

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200/50 pb-6">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 rounded-2xl">
						<Users className="w-8 h-8 text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-black bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
							Manajemen Pengguna
						</h1>
						<p className="text-sm text-base-content/60 mt-1">Kelola data, role, dan progress mahasiswa.</p>
					</div>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className="btn btn-success rounded-2xl font-bold gap-2 shadow-md shadow-success/20"
				>
					<UserPlus className="w-4 h-4" />
					Tambah Pengguna
				</button>
			</div>

			{/* Statistik Ringkasan */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard icon={GraduationCap} label="Total Mahasiswa" value={stats?.totalStudents ?? "—"} color="bg-primary/10 text-primary" />
				<StatCard icon={ShieldCheck} label="Total Admin" value={stats?.totalAdmins ?? "—"} color="bg-secondary/10 text-secondary" />
				<StatCard icon={Zap} label="Rata-rata XP" value={stats ? `${stats.avgXp} XP` : "—"} color="bg-warning/10 text-warning" />
				<StatCard icon={Activity} label="Mahasiswa Aktif" value={stats?.activeStudents ?? "—"} color="bg-success/10 text-success" />
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 justify-between bg-base-100 p-4 rounded-3xl shadow-sm border border-base-200/50 items-center">
				<div className="relative w-full sm:flex-1 max-w-md group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
					</div>
					<input
						type="text"
						placeholder="Cari berdasarkan nama atau NIM..."
						className="input input-bordered w-full pl-12 bg-base-200/30 focus:bg-base-100 border-base-200 focus:border-primary rounded-full transition-all font-medium"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex items-center w-full sm:w-auto">
					<div className="bg-base-200/40 p-1 rounded-full flex items-center border border-base-200/60 w-full sm:w-auto">
						<div className="pl-4 pr-2">
							<Filter className="w-4 h-4 text-base-content/50" />
						</div>
						<select
							className="select select-ghost focus:bg-base-100 focus:text-primary transition-colors font-medium rounded-full border-0 w-full"
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value as "ALL" | "ADMIN" | "MAHASISWA")}
						>
							<option value="ALL">Semua Role</option>
							<option value="MAHASISWA">Mahasiswa</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="bg-base-100 rounded-3xl shadow-sm border border-base-200/50 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead className="bg-base-200/30 text-base-content/80 text-sm">
							<tr>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-4 whitespace-nowrap w-0" onClick={() => handleSort("nim")}>
									<div className="flex items-center gap-2 font-bold">NIM / Username {getSortIcon("nim")}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-4 w-full min-w-[150px]" onClick={() => handleSort("name")}>
									<div className="flex items-center gap-2 font-bold">Nama Lengkap {getSortIcon("name")}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-4 whitespace-nowrap w-0" onClick={() => handleSort("role")}>
									<div className="flex items-center gap-2 font-bold">Role {getSortIcon("role")}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-4 whitespace-nowrap w-0" onClick={() => handleSort("xp")}>
									<div className="flex items-center gap-2 font-bold">Total XP {getSortIcon("xp")}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-4 whitespace-nowrap w-0" onClick={() => handleSort("createdAt")}>
									<div className="flex items-center gap-2 font-bold">Bergabung {getSortIcon("createdAt")}</div>
								</th>
								<th className="text-right py-4 px-4 font-bold whitespace-nowrap w-0">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr><td colSpan={6} className="text-center py-16"><span className="loading loading-spinner text-primary loading-lg"></span></td></tr>
							) : isError ? (
								<tr><td colSpan={6} className="text-center py-16 text-error">Gagal memuat data pengguna.</td></tr>
							) : paginatedUsers.length === 0 ? (
								<tr>
									<td colSpan={6} className="text-center py-16">
										<div className="flex flex-col items-center gap-3">
											<Users className="w-12 h-12 text-base-content/20" />
											<p className="text-base-content/60 font-medium">Tidak ada pengguna yang ditemukan.</p>
										</div>
									</td>
								</tr>
							) : (
								paginatedUsers.map((user: UserType) => (
									<tr key={user.id} className="hover:bg-primary/5 transition-colors group">
										<td className="font-mono text-sm px-4 py-4 text-base-content/80 group-hover:text-primary transition-colors whitespace-nowrap">{user.nim}</td>
										<td className="font-bold px-4 py-4">{user.name}</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<span className={clsx("badge badge-sm font-bold border-0 px-3 py-2", user.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-base-200/70 text-base-content/70")}>
												{user.role}
											</span>
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<span className="font-black text-warning flex items-center gap-1.5">
												{user.xp} <span className="text-xs font-bold opacity-70">XP</span>
											</span>
										</td>
										<td className="text-sm text-base-content/60 px-4 py-4 whitespace-nowrap">
											{new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
										</td>
										<td className="text-right px-4 py-4 whitespace-nowrap">
											<div className="flex justify-end gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
												{/* Lihat Progres */}
												<button
													className="btn btn-sm btn-circle btn-ghost text-info hover:bg-info/10"
													onClick={() => setProgressUser(user)}
													title="Lihat Progres"
												>
													<BarChart2 className="w-4 h-4" />
												</button>
												{/* Reset Password */}
												<button
													className="btn btn-sm btn-circle btn-ghost text-warning hover:bg-warning/10"
													onClick={() => handleResetPassword(user)}
													title="Reset Password ke NIM"
													disabled={resetPasswordMutation.isPending}
												>
													<KeyRound className="w-4 h-4" />
												</button>
												{/* Edit */}
												<button
													className="btn btn-sm btn-circle btn-ghost text-info hover:bg-info/10"
													onClick={() => handleEdit(user)}
													title="Edit"
												>
													<Edit className="w-4 h-4" />
												</button>
												{/* Hapus */}
												<button
													className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10"
													onClick={() => handleDelete(user)}
													title="Hapus"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{filteredAndSortedUsers.length > 0 && (
					<div className="flex items-center justify-between p-5 border-t border-base-200/50 bg-base-200/10">
						<span className="text-sm text-base-content/60 font-medium">
							Menampilkan <span className="text-base-content font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-base-content font-bold">{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)}</span> dari <span className="text-base-content font-bold">{filteredAndSortedUsers.length}</span> pengguna
						</span>
						<div className="join shadow-sm">
							<button className="join-item btn btn-sm border-base-200/50 hover:bg-base-200" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
								<ChevronLeft className="w-4 h-4" />
							</button>
							<button className="join-item btn btn-sm no-animation bg-base-100 border-base-200/50 font-bold">{currentPage} / {totalPages}</button>
							<button className="join-item btn btn-sm border-base-200/50 hover:bg-base-200" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			<UserModal
				isOpen={isEditModalOpen}
				onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
				onSave={handleSave}
				initialData={selectedUser}
				isPending={updateUserMutation.isPending}
			/>
			<CreateUserModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSave={handleCreate}
				isPending={createUserMutation.isPending}
			/>
			<UserProgressModal
				isOpen={!!progressUser}
				onClose={() => setProgressUser(null)}
				user={progressUser}
			/>
		</div>
	);
}
