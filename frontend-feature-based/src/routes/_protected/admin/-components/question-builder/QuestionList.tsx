import { Plus } from "lucide-react";
import { QuestionItemPreview } from "./QuestionItemPreview";

interface QuestionListProps {
	questions: any[];
	openModal: (q?: any) => void;
	deleteMutation: (id: string) => void;
	isDeleting: boolean;
}

export const QuestionList = ({
	questions,
	openModal,
	deleteMutation,
	isDeleting,
}: QuestionListProps) => {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-xl font-bold">Daftar Pertanyaan</h3>
				<button
					onClick={() => openModal()}
					className="btn btn-primary btn-sm"
				>
					<Plus className="w-4 h-4 mr-2" /> Tambah Soal
				</button>
			</div>

			{questions.length === 0 ? (
				<div className="text-center p-10 bg-base-200/50 rounded-xl border-2 border-dashed border-base-300">
					<p className="text-base-content/60">
						Belum ada soal untuk kuis ini.
					</p>
					<button
						onClick={() => openModal()}
						className="btn btn-primary btn-sm mt-4"
					>
						<Plus className="w-4 h-4 mr-2" /> Buat Soal Pertama
					</button>
				</div>
			) : (
				questions.map((q, idx) => (
					<QuestionItemPreview
						key={q.id}
						q={q}
						idx={idx}
						openModal={openModal}
						deleteMutation={deleteMutation}
						isDeleting={isDeleting}
					/>
				))
			)}
		</div>
	);
};
