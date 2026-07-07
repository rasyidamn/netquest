import { CheckCircle2, Edit2, Link as LinkIcon, Network, Trash2, Calculator, Image, ListChecks, ListOrdered, Terminal, Type, Zap, MapPin } from "lucide-react";

export const PreviewTextOrImage = ({ text }: { text: string }) => {
	if (!text) return <span>?</span>;
	const imgMatch = text.match(/!\[(.*?)\]\((.*?)\)/);
	// Also handle bare URLs (for VISUAL_IDENTIFICATION base image)
	if (text.startsWith("http")) {
		return (
			<img src={text} alt="preview" className="h-12 max-w-[6rem] object-contain rounded bg-base-200/50" />
		);
	}
	if (imgMatch) {
		const [, alt, url] = imgMatch;
		const remainingText = text.replace(imgMatch[0], "").trim();
		return (
			<div className="flex flex-col items-center justify-center gap-1 w-full mx-auto">
				<img src={url} alt={alt || "preview"} className="h-12 max-w-[6rem] object-contain rounded bg-base-200/50" />
				{remainingText && <span className="text-[10px] md:text-xs break-words whitespace-normal leading-tight">{remainingText}</span>}
			</div>
		);
	}
	return <span className="break-words whitespace-normal">{text}</span>;
};

interface QuestionItemPreviewProps {
	q: any;
	idx: number;
	openModal: (q: any) => void;
	deleteMutation: (id: string) => void;
	isDeleting: boolean;
}

export const QuestionItemPreview = ({
	q,
	idx,
	openModal,
	deleteMutation,
	isDeleting,
}: QuestionItemPreviewProps) => {
	const getTypeIcon = (type: string) => {
		switch (type) {
			case "MULTIPLE_CHOICE":
				return <ListChecks className="w-4 h-4" />;
			case "COMMAND_TYPING":
				return <Terminal className="w-4 h-4" />;
			case "MATCHING":
				return <LinkIcon className="w-4 h-4" />;
			case "CALCULATION_INPUT":
				return <Calculator className="w-4 h-4" />;
			case "SORTING":
				return <ListOrdered className="w-4 h-4" />;
			case "TOPOLOGY":
				return <Network className="w-4 h-4" />;
			case "RAPID_TRUE_FALSE":
				return <Zap className="w-4 h-4 text-orange-500" />;
			case "VISUAL_IDENTIFICATION":
				return <MapPin className="w-4 h-4 text-red-500" />;
			default:
				return <Type className="w-4 h-4" />;
		}
	};

	return (
		<div
			className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary/30 transition-colors"
		>
			<div className="card-body p-4 sm:p-6">
				<div className="flex justify-between items-start gap-4">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<div className="badge badge-primary gap-1">
								{getTypeIcon(q.type)}
								Soal {q.questionSequence || idx + 1}
							</div>
							<div className="badge badge-ghost text-xs">
								{q.type}
							</div>
						</div>
						<h4 className="font-semibold text-lg">
							{q.questionText}
						</h4>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => openModal(q)}
							className="btn btn-square btn-sm btn-ghost text-info"
						>
							<Edit2 className="w-4 h-4" />
						</button>
						<button
							onClick={() => {
								if (confirm("Yakin ingin menghapus soal ini?"))
									deleteMutation(q.id);
							}}
							disabled={isDeleting}
							className="btn btn-square btn-sm btn-ghost text-error"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</div>

				<div className="mt-4">
					{q.type === "MULTIPLE_CHOICE" || q.type === "RAPID_TRUE_FALSE" ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{q.options?.map((opt: any, oIdx: number) => (
								<div
									key={opt.id}
									className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${
										opt.isCorrect
											? "bg-success/10 border-success/30"
											: "bg-base-200/50 border-base-200"
									}`}
								>
									<div className="w-6 h-6 shrink-0 rounded-full bg-base-100 flex items-center justify-center text-xs font-bold shadow-sm">
										{String.fromCharCode(65 + oIdx)}
									</div>
									<div className="flex-1">
										<PreviewTextOrImage text={opt.optionText} />
									</div>
									{opt.isCorrect && (
										<CheckCircle2 className="w-4 h-4 text-success shrink-0" />
									)}
								</div>
							))}
						</div>
					) : q.type === "MATCHING" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{(() => {
								const answerKeyOpt = q.options?.find(
									(opt: any) => opt.isCorrect,
								);
								if (answerKeyOpt) {
									try {
										const pattern = JSON.parse(
											answerKeyOpt.optionText,
										);
										return pattern.map(
											(pair: string[], i: number) => {
												const leftOpt = q.options.find(
													(o: any) => o.id === pair[0],
												);
												const rightOpt = q.options.find(
													(o: any) => o.id === pair[1],
												);
												return (
													<div
														key={i}
														className="flex items-center p-2 rounded-lg border border-base-200 bg-base-100/50 text-sm"
													>
														<div className="flex-1 text-center font-medium">
															<PreviewTextOrImage text={leftOpt?.optionText || ""} />
														</div>
														<LinkIcon className="w-4 h-4 text-base-content/30 mx-2 shrink-0" />
														<div className="flex-1 text-center font-medium">
															<PreviewTextOrImage text={rightOpt?.optionText || ""} />
														</div>
													</div>
												);
											},
										);
									} catch (e) {}
								}
								return null;
							})()}
						</div>
					) : q.type === "SORTING" ? (
						<div className="flex flex-col gap-2 bg-base-200/30 p-2 rounded-lg border border-base-200">
							{(() => {
								const answerKeyOpt = q.options?.find(
									(opt: any) => opt.isCorrect,
								);
								if (answerKeyOpt) {
									try {
										const pattern = JSON.parse(
											answerKeyOpt.optionText,
										);
										return pattern.map(
											(id: string, i: number) => {
												const opt = q.options.find(
													(o: any) => o.id === id,
												);
												return (
													<div
														key={i}
														className="flex items-center gap-3 p-2 rounded-md bg-base-100 border shadow-sm text-sm"
													>
														<div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
															{i + 1}
														</div>
														<div className="flex-1 font-medium">
															<PreviewTextOrImage text={opt?.optionText || ""} />
														</div>
													</div>
												);
											},
										);
									} catch (e) {}
								}
								return null;
							})()}
						</div>
					) : q.type === "TOPOLOGY" || q.type === "VISUAL_IDENTIFICATION" ? (
						<div className="p-3 rounded-lg border bg-info/10 border-info/30 text-info-content text-sm flex items-center gap-2">
							<div className="badge badge-info badge-sm">
								Kunci Jawaban {q.type === "TOPOLOGY" ? "Topologi" : "Hotspot"}
							</div>
							<span className="flex-1 font-mono">
								Tersimpan (Buka edit untuk melihat)
							</span>
							{q.type === "TOPOLOGY" ? <Network className="w-4 h-4 shrink-0" /> : <MapPin className="w-4 h-4 shrink-0" />}
						</div>
					) : (
						// Untuk COMMAND_TYPING / CALCULATION_INPUT (Tipe Isian) dsb
						<div className="p-3 rounded-lg border bg-success/10 border-success/30 text-success-content text-sm flex items-center gap-2">
							<div className="badge badge-success badge-sm font-bold">
								Kunci Jawaban
							</div>
							<span className="flex-1 font-mono text-base-content">
								{q.options?.[0]?.optionText || "-"}
							</span>
							<CheckCircle2 className="w-4 h-4 shrink-0" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
