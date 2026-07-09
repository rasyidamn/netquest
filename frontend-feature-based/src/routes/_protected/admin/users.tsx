import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Edit, Trash2, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import clsx from "clsx";

import { useUsers } from "@/feature/user/hooks/useUsers";
import { userApi } from "@/feature/user/api/userApi";
import { UserModal } from "./-components/UserModal";
import type { UserType, UpdateUserType } from "@/feature/user/schema/user.schema";

export const Route = createFileRoute("/_protected/admin/users")({
	component: AdminUsersPage,
});

function AdminUsersPage() {
	const queryClient = useQueryClient();
	const { data: users = [], isLoading, isError } = useUsers();

	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "MAHASISWA">("ALL");
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Pagination & Sorting States
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof UserType;
		direction: "asc" | "desc";
	} | null>(null);
	const itemsPerPage = 10;

	const updateUserMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserType }) =>
			userApi.updateUser({ id, data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("Data pengguna berhasil diperbarui!");
			setIsModalOpen(false);
			setSelectedUser(null);
		},
		onError: (error: any) => toast.error(error.message),
	});

	const deleteUserMutation = useMutation({
		mutationFn: (id: string) => userApi.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("Pengguna berhasil dihapus!");
		},
		onError: (error: any) => toast.error(error.message),
	});

	const handleEdit = (user: UserType) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleDelete = (user: UserType) => {
		if (
			window.confirm(
				`Apakah Anda yakin ingin menghapus pengguna "${user.name}"? PERINGATAN: Semua progres dan histori kuisnya akan ikut terhapus selamanya.`
			)
		) {
			deleteUserMutation.mutate(user.id);
		}
	};

	const handleSave = (data: UpdateUserType) => {
		if (selectedUser) {
			updateUserMutation.mutate({ id: selectedUser.id, data });
		}
	};

	const handleSort = (key: keyof UserType) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof UserType) => {
		if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />;
		return sortConfig.direction === "asc" ? (
			<ArrowUp className="w-4 h-4 text-primary" />
		) : (
			<ArrowDown className="w-4 h-4 text-primary" />
		);
	};

	// 1. Filter and Sort
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

	// 2. Paginate
	const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / itemsPerPage));
	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredAndSortedUsers, currentPage]);

	// Reset page when filter/search changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, roleFilter]);

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
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
						<p className="text-sm text-base-content/60 mt-1">
							Kelola data, role, dan progress mahasiswa.
						</p>
					</div>
				</div>
			</div>

			{/* Filters & Actions */}
			<div className="flex flex-col sm:flex-row gap-4 justify-between bg-base-100 p-4 rounded-3xl shadow-sm border border-base-200/50 items-center">
				<div className="relative w-full sm:flex-1 max-w-md group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
					</div>
					<input
						type="text"
						placeholder="Cari berdasarkan nama atau NIM..."
						className="input input-bordered w-full pl-12 bg-base-200/30 focus:bg-base-100 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full transition-all font-medium"
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
							onChange={(e) =>
								setRoleFilter(e.target.value as "ALL" | "ADMIN" | "MAHASISWA")
							}
						>
							<option value="ALL">Semua Role</option>
							<option value="MAHASISWA">Mahasiswa</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>
				</div>
			</div>

			{/* Table Content */}
			<div className="bg-base-100 rounded-3xl shadow-sm border border-base-200/50 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead className="bg-base-200/30 text-base-content/80 text-sm">
							<tr>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-6" onClick={() => handleSort('nim')}>
									<div className="flex items-center gap-2 font-bold">NIM / Username {getSortIcon('nim')}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-6" onClick={() => handleSort('name')}>
									<div className="flex items-center gap-2 font-bold">Nama Lengkap {getSortIcon('name')}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-6" onClick={() => handleSort('role')}>
									<div className="flex items-center gap-2 font-bold">Role {getSortIcon('role')}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-6" onClick={() => handleSort('xp')}>
									<div className="flex items-center gap-2 font-bold">Total XP {getSortIcon('xp')}</div>
								</th>
								<th className="cursor-pointer hover:bg-base-300/50 transition-colors group py-4 px-6" onClick={() => handleSort('createdAt')}>
									<div className="flex items-center gap-2 font-bold">Bergabung Pada {getSortIcon('createdAt')}</div>
								</th>
								<th className="text-right py-4 px-6 font-bold">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan={6} className="text-center py-16">
										<span className="loading loading-spinner text-primary loading-lg"></span>
									</td>
								</tr>
							) : isError ? (
								<tr>
									<td colSpan={6} className="text-center py-16 text-error">
										Gagal memuat data pengguna.
									</td>
								</tr>
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
										<td className="font-mono text-sm px-6 py-4 text-base-content/80 group-hover:text-primary transition-colors">{user.nim}</td>
										<td className="font-bold px-6 py-4">{user.name}</td>
										<td className="px-6 py-4">
											<span
												className={clsx(
													"badge badge-sm font-bold border-0 px-3 py-2",
													user.role === "ADMIN"
														? "bg-primary/10 text-primary"
														: "bg-base-200/70 text-base-content/70"
												)}
											>
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="font-black text-warning flex items-center gap-1.5">
												{user.xp} <span className="text-xs font-bold opacity-70">XP</span>
											</span>
										</td>
										<td className="text-sm text-base-content/60 px-6 py-4">
											{new Date(user.createdAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="text-right px-6 py-4">
											<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													className="btn btn-sm btn-circle btn-ghost text-info hover:bg-info/10 hover:text-info"
													onClick={() => handleEdit(user)}
													title="Edit"
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 hover:text-error"
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
				
				{/* Pagination Controls */}
				{filteredAndSortedUsers.length > 0 && (
					<div className="flex items-center justify-between p-5 border-t border-base-200/50 bg-base-200/10">
						<span className="text-sm text-base-content/60 font-medium">
							Menampilkan <span className="text-base-content font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-base-content font-bold">{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)}</span> dari <span className="text-base-content font-bold">{filteredAndSortedUsers.length}</span> pengguna
						</span>
						<div className="join shadow-sm">
							<button 
								className="join-item btn btn-sm border-base-200/50 hover:bg-base-200" 
								onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
							<button className="join-item btn btn-sm no-animation bg-base-100 border-base-200/50 font-bold">
								{currentPage} / {totalPages}
							</button>
							<button 
								className="join-item btn btn-sm border-base-200/50 hover:bg-base-200" 
								onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>

			<UserModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedUser(null);
				}}
				onSave={handleSave}
				initialData={selectedUser}
				isPending={updateUserMutation.isPending}
			/>
		</div>
	);
}

