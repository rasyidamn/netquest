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

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-3xl bg-base-100">
				<h3 className="font-black text-xl mb-4 pb-2 border-b border-base-200 text-base-content">
					{editingId ? "Edit Soal" : "Tambah Soal Baru"}
				</h3>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-bold text-base-content">
									Tipe Soal
								</span>
							</label>
							<select
								className="select select-bordered w-full bg-base-200"
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
						
						<div className="form-control w-1/4">
							<label className="label">
								<span className="label-text font-bold text-base-content">
									Urutan Soal
								</span>
							</label>
							<input
								type="number"
								min="1"
								{...register("questionSequence", { valueAsNumber: true })}
								className={clsx(
									"input input-bordered w-full bg-base-200/50",
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

					<div className="form-control flex flex-col">
						<label className="label">
							<span className="label-text font-bold text-base-content">
								Pertanyaan
							</span>
						</label>
						<textarea
							{...register("questionText")}
							className="textarea textarea-bordered h-24 bg-base-200/50"
							placeholder="Tulis pertanyaan di sini..."
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
			
			<form method="dialog" className="modal-backdrop">
				<button onClick={closeModal}>close</button>
			</form>
		</div>
	);
};
