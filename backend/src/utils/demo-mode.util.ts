/**
 * Daftar NIM akun demo yang digunakan untuk keperluan demonstrasi/pengujian dosen.
 * Akun dalam daftar ini dapat melewati soal tanpa menjawab dan tidak mendapatkan XP.
 */
export const DEMO_NIMS: string[] = ["messiugoat"];

export const isDemoUser = (nim: string): boolean => {
	return DEMO_NIMS.includes(nim);
};
