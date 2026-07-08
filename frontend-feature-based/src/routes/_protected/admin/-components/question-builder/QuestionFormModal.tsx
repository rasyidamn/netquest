import { Loader2 } from "lucide-react";
import { MultipleChoiceInput } from "./inputs/MultipleChoiceInput";
import { MatchingInputGroup } from "./inputs/MatchingInput";
import { SortingInput } from "./inputs/SortingInput";
import { TopologyFormInput } from "./inputs/TopologyFormInput";
import { ShortAnswerInput } from "./inputs/ShortAnswerInput";
import { RapidTrueFalseInput } from "./inputs/RapidTrueFalseInput";
import { VisualIdentificationInput } from "./inputs/VisualIdentificationInput";
import clsx from "clsx";

interface QuestionFormModalProps {
	isModalOpen: boolean;
	closeModal: () => void;
	editingId: string | null;
	handleSubmit: any;
	onSubmit: (data: any) => void;
	register: any;
	errors: any;
	selectedType: string;
	handleTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	// Multiple Choice props
	optionFields: any[];
	appendOption: (val: any) => void;
	removeOption: (index: number) => void;
	setCorrectAnswer: (index: number) => void;
	// Matching props
	pairFields: any[];
	getValues: any;
	setValue: any;
	control: any;
	appendPair: (val: any) => void;
	removePair: (index: number) => void;
	// Sorting/Image Labeling props
	labelFields: any[];
	appendLabel: (val: any) => void;
	removeLabel: (index: number) => void;
	// Topology props
	currentTopologyNodes: any[];
	currentTopologyEdges: any[];
	// Submission state
	isCreating: boolean;
	isUpdating: boolean;
}

export const QuestionFormModal = ({
	isModalOpen,
	closeModal,
	editingId,
	handleSubmit,
	onSubmit,
	register,
	errors,
	selectedType,
	handleTypeChange,
	optionFields,
	appendOption,
	removeOption,
	setCorrectAnswer,
	pairFields,
	getValues,
	setValue,
	control,
	appendPair,
	removePair,
	labelFields,
	appendLabel,
	removeLabel,
	currentTopologyNodes,
	currentTopologyEdges,
	isCreating,
	isUpdating,
}: QuestionFormModalProps) => {
	if (!isModalOpen) return null;

	const getGuidelines = (type: string) => {
		switch (type) {
			case "MULTIPLE_CHOICE":
				return "Tulis pertanyaan dan tambahkan opsi jawaban. Jangan lupa memilih salah satu opsi sebagai jawaban yang benar menggunakan tombol radio.";
			case "COMMAND_TYPING":
				return "Siswa akan diminta mengetik perintah CLI (Command Line Interface). Masukkan sintaks perintah yang benar persis seperti yang harus diketikkan.";
			case "CALCULATION_INPUT":
				return "Siswa akan diminta memasukkan jawaban berupa angka atau hasil perhitungan (misal: Subnet mask, jumlah host). Masukkan nilai yang tepat.";
			case "MATCHING":
				return "Tambahkan pasangan (Pasangan A dan Pasangan B) yang berhubungan. Sistem akan mengacak urutan secara otomatis saat kuis berlangsung.";
			case "SORTING":
				return "Masukkan daftar langkah atau item dalam urutan yang BENAR dari atas ke bawah. Sistem akan mengacaknya secara otomatis untuk siswa.";
			case "TOPOLOGY":
				return "Rancang topologi jaringan di kanvas. Tambahkan perangkat dan hubungkan kabel sebagai 'Kunci Jawaban' yang harus ditiru atau dibuat oleh siswa.";
			case "RAPID_TRUE_FALSE":
				return "Tambahkan sebuah pernyataan pada opsi. Tentukan apakah pernyataan tersebut bernilai 'Benar' (True) atau 'Salah' (False).";
			case "VISUAL_IDENTIFICATION":
				return "Unggah gambar (via URL atau sistem), lalu klik pada gambar untuk menentukan titik koordinat yang benar (Hotspot) yang harus ditebak oleh siswa.";
			default:
				return "Silakan lengkapi pengaturan soal ini.";
		}
	};

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-4xl bg-base-100 shadow-2xl p-0 overflow-hidden">
				{/* Modal Header */}
				<div className="bg-base-200/50 px-6 py-4 border-b border-base-200 flex items-center justify-between">
					<h3 className="font-black text-xl text-base-content">
						{editingId ? "Edit Soal" : "Tambah Soal Baru"}
					</h3>
					<button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">✕</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						
						{/* Baris Pertama: Tipe Soal & Urutan */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/30 p-4 rounded-xl border border-base-200">
							<div className="form-control md:col-span-2">
								<label className="label pt-0">
									<span className="label-text font-bold text-base-content">
										Tipe Kuis
									</span>
								</label>
								<select
									className="select select-bordered w-full bg-base-100 font-medium"
									value={selectedType}
									onChange={handleTypeChange}
								>
									<option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
									<option value="COMMAND_TYPING">Ketik Perintah (CLI)</option>
									<option value="CALCULATION_INPUT">Input Kalkulasi/Angka</option>
									<option value="MATCHING">Menjodohkan (Matching)</option>
									<option value="SORTING">Urutkan Item (Sorting)</option>
									<option value="TOPOLOGY">Topologi Jaringan (Canvas)</option>
									<option value="RAPID_TRUE_FALSE">Swift Card (Benar/Salah)</option>
									<option value="VISUAL_IDENTIFICATION">Hotspot (Titik Gambar)</option>
								</select>
							</div>
							
							<div className="form-control">
								<label className="label pt-0">
									<span className="label-text font-bold text-base-content">
										No. Urut
									</span>
								</label>
								<input
									type="number"
									min="1"
									{...register("questionSequence", { valueAsNumber: true })}
									className={clsx(
										"input input-bordered w-full bg-base-100",
										errors.questionSequence && "input-error"
									)}
									placeholder="Misal: 1"
								/>
								{errors.questionSequence && (
									<span className="text-error text-xs mt-1">
										{errors.questionSequence.message}
									</span>
								)}
							</div>
						</div>

						{/* Guidelines / Petunjuk Khusus Tipe Soal */}
						<div className="alert bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl p-4 flex gap-3 shadow-sm">
							<div className="bg-blue-500/20 p-2 rounded-full shrink-0">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
							</div>
							<div>
								<h4 className="font-bold text-sm mb-1">Petunjuk Admin</h4>
								<p className="text-sm opacity-90 leading-relaxed">{getGuidelines(selectedType)}</p>
							</div>
						</div>

						{/* Input Pertanyaan */}
						<div className="form-control flex flex-col">
							<label className="label">
								<span className="label-text font-bold text-base-content">
									Teks Pertanyaan / Instruksi Soal
								</span>
							</label>
							<textarea
								{...register("questionText")}
								className="textarea textarea-bordered w-full h-28 bg-base-100 resize-none font-medium text-base focus:border-primary"
								placeholder="Tuliskan konteks studi kasus, instruksi soal, atau pertanyaan utama di sini..."
							/>
							{errors.questionText && (
								<span className="text-error text-xs mt-1">
									{errors.questionText.message}
								</span>
							)}
						</div>

					<div className="divider text-sm font-bold text-base-content/40">
						Jawaban & Opsi
					</div>

					{selectedType === "MULTIPLE_CHOICE" ? (
						<MultipleChoiceInput
							register={register}
							errors={errors}
							setValue={setValue}
							getValues={getValues}
							control={control}
							optionFields={optionFields}
							appendOption={appendOption}
							removeOption={removeOption}
							setCorrectAnswer={setCorrectAnswer}
						/>
					) : selectedType === "MATCHING" ? (
						<MatchingInputGroup
							pairFields={pairFields}
							register={register}
							getValues={getValues}
							setValue={setValue}
							errors={errors}
							control={control}
							removePair={removePair}
							appendPair={appendPair}
						/>
					) : selectedType === "SORTING" ? (
						<SortingInput
							register={register}
							errors={errors}
							setValue={setValue}
							getValues={getValues}
							control={control}
							labelTitle={selectedType === "SORTING" ? "Daftar Jawaban (Urutan Benar)" : "Pasangan Label (Kiri = Pertanyaan, Kanan = Jawaban)"}
							labelFields={labelFields}
							appendLabel={appendLabel}
							removeLabel={removeLabel}
						/>
					) : selectedType === "TOPOLOGY" ? (
						<TopologyFormInput
							currentTopologyNodes={currentTopologyNodes}
							currentTopologyEdges={currentTopologyEdges}
							setValue={setValue}
							errors={errors}
						/>
					) : selectedType === "RAPID_TRUE_FALSE" ? (
						<RapidTrueFalseInput
							errors={errors}
							optionFields={optionFields}
							setCorrectAnswer={setCorrectAnswer}
						/>
					) : selectedType === "VISUAL_IDENTIFICATION" ? (
						<VisualIdentificationInput
							setValue={setValue}
							control={control}
							errors={errors}
						/>
					) : (
						<ShortAnswerInput
							register={register}
							errors={errors}
							selectedType={selectedType}
						/>
					)}

					{errors.options?.root && (
						<div className="text-error text-sm text-center bg-error/10 p-2 rounded-lg">
							{errors.options.root.message}
						</div>
					)}
					{errors.matchingPairs?.root && (
						<div className="text-error text-sm text-center bg-error/10 p-2 rounded-lg">
							{errors.matchingPairs.root.message}
						</div>
					)}

					<div className="modal-action mt-6 pt-4 border-t border-base-200">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={closeModal}
						>
							Batal
						</button>
						<button
							type="submit"
							className="btn btn-primary min-w-[120px]"
							disabled={isCreating || isUpdating}
						>
							{isCreating || isUpdating ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								"Simpan Soal"
							)}
						</button>
					</div>
				</form>
				</div>
			</div>
			
			<form method="dialog" className="modal-backdrop">
				<button onClick={closeModal}>close</button>
			</form>
		</div>
	);
};
