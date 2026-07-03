import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonApi } from "@/feature/module/api/lessonApi";
import {
	Plus,
	Trash2,
	Edit2,
	CheckCircle2,
	HelpCircle,
	Link as LinkIcon,
	Network,
} from "lucide-react";
import toast from "react-hot-toast";
import { TopologyEditor } from "@/feature/gameplay/components/TopologyEditor";

const questionFormSchema = z
	.object({
		id: z.string().optional(),
		type: z.enum([
			"MULTIPLE_CHOICE",
			"COMMAND_TYPING",
			"CALCULATION_INPUT",
			"MATCHING",
			"IMAGE_LABELING",
			"SORTING",
			"TOPOLOGY",
		]),
		questionText: z.string().min(5, "Pertanyaan terlalu pendek"),
		options: z
			.array(
				z.object({
					id: z.string().optional(),
					optionText: z
						.string()
						.min(1, "Opsi/Jawaban tidak boleh kosong"),
					isCorrect: z.boolean(),
				}),
			)
			.optional()
			.default([]),
		matchingPairs: z
			.array(
				z.object({
					left: z.string().min(1, "Sisi kiri wajib diisi"),
					right: z.string().min(1, "Sisi kanan wajib diisi"),
				}),
			)
			.optional(),
		imageLabels: z
			.array(
				z.object({
					value: z.string().min(1, "Label wajib diisi"),
				}),
			)
			.optional(),
		topologyNodes: z.any().optional(),
		topologyEdges: z.any().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.type === "MULTIPLE_CHOICE") {
			if (data.options.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Pilihan ganda minimal harus memiliki 2 opsi",
					path: ["options"],
				});
			}
			if (!data.options.some((opt) => opt.isCorrect)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Pilihan ganda harus memiliki 1 jawaban benar",
					path: ["options"],
				});
			}
		} else if (data.type === "MATCHING") {
			if (!data.matchingPairs || data.matchingPairs.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Kuis menjodohkan minimal memiliki 2 pasang jawaban",
					path: ["matchingPairs"],
				});
			}
		} else if (data.type === "IMAGE_LABELING" || data.type === "SORTING") {
			if (!data.imageLabels || data.imageLabels.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Minimal harus ada 2 label/item untuk diurutkan",
					path: ["imageLabels"],
				});
			}
		} else if (data.type === "TOPOLOGY") {
			if (!data.topologyNodes || data.topologyNodes.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Minimal harus ada 2 perangkat (nodes) untuk disambungkan",
					path: ["topologyNodes"],
				});
			}
		} else {
			// COMMAND_TYPING / CALCULATION_INPUT
			if (data.options.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Kunci jawaban harus diisi",
					path: ["options"],
				});
			}
		}
	});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

export function QuestionBuilder({
	lessonId,
	questions = [],
}: {
	lessonId: string;
	questions: any[];
}) {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<QuestionFormValues>({
		resolver: zodResolver(questionFormSchema) as any,
		defaultValues: {
			type: "MULTIPLE_CHOICE",
			questionText: "",
			options: [
				{ optionText: "", isCorrect: true },
				{ optionText: "", isCorrect: false },
			],
			matchingPairs: [],
			imageLabels: [],
			topologyNodes: [],
			topologyEdges: [],
		},
	});

	const selectedType = useWatch({ control, name: "type" });
	const currentTopologyNodes = useWatch({ control, name: "topologyNodes" });
	const currentTopologyEdges = useWatch({ control, name: "topologyEdges" });

	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption,
		replace: replaceOptions,
	} = useFieldArray({
		control,
		name: "options",
	});

	const {
		fields: pairFields,
		append: appendPair,
		remove: removePair,
	} = useFieldArray({
		control,
		name: "matchingPairs",
	});

	const {
		fields: labelFields,
		append: appendLabel,
		remove: removeLabel,
	} = useFieldArray({
		control,
		name: "imageLabels",
	});

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value as any;
		setValue("type", newType);

		// Reset seluruh array khusus agar tidak mengganggu validasi Zod
		setValue("options", []);
		setValue("matchingPairs", []);
		setValue("imageLabels", []);
		setValue("topologyNodes", []);
		setValue("topologyEdges", []);

		if (newType === "MULTIPLE_CHOICE") {
			setValue("options", [
				{ optionText: "", isCorrect: true },
				{ optionText: "", isCorrect: false },
			]);
		} else if (newType === "MATCHING") {
			setValue("matchingPairs", [
				{ left: "", right: "" },
				{ left: "", right: "" },
			]);
		} else if (newType === "IMAGE_LABELING" || newType === "SORTING") {
			setValue("imageLabels", [{ value: "" }, { value: "" }]);
		} else if (
			newType === "COMMAND_TYPING" ||
			newType === "CALCULATION_INPUT"
		) {
			setValue("options", [{ optionText: "", isCorrect: true }]);
		}
	};

	const { mutate: createMutation, isPending: isCreating } = useMutation({
		mutationFn: (data: any) => lessonApi.createQuestion(lessonId, data),
		onSuccess: () => {
			toast.success("Soal berhasil ditambahkan!");
			closeModal();
			queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
		},
		onError: (error: any) =>
			toast.error(
				error?.response?.data?.message || "Gagal menambahkan soal",
			),
	});

	const { mutate: updateMutation, isPending: isUpdating } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			lessonApi.updateQuestion({ id, data }),
		onSuccess: () => {
			toast.success("Soal berhasil diperbarui!");
			closeModal();
			queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
		},
		onError: (error: any) =>
			toast.error(
				error?.response?.data?.message || "Gagal memperbarui soal",
			),
	});

	const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => lessonApi.deleteQuestion(id),
		onSuccess: () => {
			toast.success("Soal dihapus!");
			queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
		},
		onError: () => toast.error("Gagal menghapus soal"),
	});

	const onSubmit = (data: QuestionFormValues) => {
		let payload: any = {
			questionText: data.questionText,
			type: data.type,
			xpReward: 0,
		};

		if (data.type === "MATCHING" && data.matchingPairs) {
			const numPairs = data.matchingPairs.length;
			const lefts = data.matchingPairs.map((p) => p.left);
			const rights = data.matchingPairs.map((p) => p.right);

			payload.advancedOptions = [...lefts, ...rights];
			payload.answerPattern = data.matchingPairs.map((_, i) => [
				i,
				i + numPairs,
			]);
			payload.options = [];
		} else if (
			(data.type === "IMAGE_LABELING" || data.type === "SORTING") &&
			data.imageLabels
		) {
			const labels = data.imageLabels.map((l) => l.value);
			payload.advancedOptions = labels;
			payload.answerPattern = labels.map((_, i) => i);
			payload.options = [];
		} else if (
			data.type === "TOPOLOGY" &&
			data.topologyNodes &&
			data.topologyEdges
		) {
			const formattedEdges = data.topologyEdges.map((e: any) => {
				const sourceFirst = e.source < e.target;
				return sourceFirst
					? `${e.source}-${e.target}`
					: `${e.target}-${e.source}`;
			});
			payload.options = [
				{
					optionText: JSON.stringify(data.topologyNodes),
					isCorrect: false,
				},
				{ optionText: JSON.stringify(formattedEdges), isCorrect: true },
			];
		} else {
			payload.options = data.options;
		}

		if (editingId) {
			updateMutation({ id: editingId, data: payload });
		} else {
			createMutation(payload);
		}
	};

	const openModal = (question?: any) => {
		if (question) {
			setEditingId(question.id);

			let matchingPairs: any[] = [];
			if (question.type === "MATCHING" && question.options) {
				const answerKeyOpt = question.options.find(
					(opt: any) => opt.isCorrect,
				);
				if (answerKeyOpt) {
					try {
						const pattern = JSON.parse(answerKeyOpt.optionText);
						matchingPairs = pattern.map((pair: string[]) => {
							const leftOpt = question.options.find(
								(o: any) => o.id === pair[0],
							);
							const rightOpt = question.options.find(
								(o: any) => o.id === pair[1],
							);
							return {
								left: leftOpt?.optionText || "",
								right: rightOpt?.optionText || "",
							};
						});
					} catch (e) {}
				}
			}
			if (question.type === "MATCHING" && matchingPairs.length === 0) {
				matchingPairs = [
					{ left: "", right: "" },
					{ left: "", right: "" },
				];
			}

			let imageLabels: any[] = [];
			if (
				(question.type === "IMAGE_LABELING" ||
					question.type === "SORTING") &&
				question.options
			) {
				const answerKeyOpt = question.options.find(
					(opt: any) => opt.isCorrect,
				);
				if (answerKeyOpt) {
					try {
						const pattern = JSON.parse(
							answerKeyOpt.optionText,
						) as number[];
						imageLabels = pattern.map((id) => {
							const opt = question.options.find(
								(o: any) => o.id === id,
							);
							return { value: opt?.optionText || "" };
						});
					} catch (e) {}
				}
			}
			if (
				(question.type === "IMAGE_LABELING" ||
					question.type === "SORTING") &&
				imageLabels.length === 0
			) {
				imageLabels = [{ value: "" }, { value: "" }];
			}

			let topologyNodes = [];
			let topologyEdges = [];
			if (question.type === "TOPOLOGY" && question.options) {
				const answerKeyOpt = question.options.find(
					(opt: any) => opt.isCorrect,
				);
				const nodesOpt = question.options.find(
					(opt: any) => !opt.isCorrect,
				);

				if (nodesOpt) {
					try {
						topologyNodes = JSON.parse(nodesOpt.optionText);
					} catch (e) {}
				}

				if (answerKeyOpt) {
					try {
						const edgeStrings = JSON.parse(answerKeyOpt.optionText);
						topologyEdges = edgeStrings.map(
							(edgeStr: string, idx: number) => {
								const [source, target] = edgeStr.split("-");
								return {
									id: `e-${source}-${target}-${idx}`,
									source,
									target,
								};
							},
						);
					} catch (e) {}
				}
			}

			reset({
				id: question.id,
				type: question.type || "MULTIPLE_CHOICE",
				questionText: question.questionText,
				options: question.options
					? question.options.map((opt: any) => ({
							id: opt.id,
							optionText: opt.optionText,
							isCorrect: opt.isCorrect,
						}))
					: [],
				matchingPairs,
				imageLabels,
				topologyNodes,
				topologyEdges,
			});
		} else {
			setEditingId(null);
			reset({
				type: "MULTIPLE_CHOICE",
				questionText: "",
				xpReward: 50,
				options: [
					{ optionText: "", isCorrect: true },
					{ optionText: "", isCorrect: false },
				],
				matchingPairs: [],
				imageLabels: [],
				topologyNodes: [],
				topologyEdges: [],
			});
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingId(null);
	};

	const setCorrectAnswer = (index: number) => {
		const currentOptions = getValues("options");
		const newOptions = currentOptions.map((opt, i) => ({
			...opt,
			isCorrect: i === index,
		}));
		replaceOptions(newOptions);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-bold">Daftar Soal Pop Quiz</h3>
					<p className="text-sm text-base-content/60">
						Kelola soal latihan untuk materi ini.
					</p>
				</div>
				<button
					onClick={() => openModal()}
					className="btn btn-primary btn-sm"
				>
					<Plus className="w-4 h-4" /> Tambah Soal
				</button>
			</div>

			<div className="grid gap-4 mt-4">
				{questions.length === 0 ? (
					<div className="text-center py-10 bg-base-200/50 rounded-xl border border-dashed border-base-300">
						<HelpCircle className="w-10 h-10 mx-auto text-base-content/30 mb-2" />
						<p className="text-base-content/60">
							Belum ada soal kuis.
						</p>
					</div>
				) : (
					questions.map((q, idx) => (
						<div
							key={q.id}
							className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary/30 transition-colors"
						>
							<div className="card-body p-4 sm:p-6">
								<div className="flex justify-between items-start gap-4">
									<div>
										<div className="flex items-center gap-2 mb-2">
											<div className="badge badge-primary">
												Soal {idx + 1}
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
												if (
													confirm(
														"Yakin ingin menghapus soal ini?",
													)
												)
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
									{q.type === "MULTIPLE_CHOICE" ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											{q.options?.map(
												(opt: any, oIdx: number) => (
													<div
														key={opt.id}
														className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${
															opt.isCorrect
																? "bg-success/10 border-success/30"
																: "bg-base-200/50 border-base-200"
														}`}
													>
														<div className="w-6 h-6 shrink-0 rounded-full bg-base-100 flex items-center justify-center text-xs font-bold shadow-sm">
															{String.fromCharCode(
																65 + oIdx,
															)}
														</div>
														<span className="flex-1">
															{opt.optionText}
														</span>
														{opt.isCorrect && (
															<CheckCircle2 className="w-4 h-4 text-success shrink-0" />
														)}
													</div>
												),
											)}
										</div>
									) : q.type === "MATCHING" ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{(() => {
												const answerKeyOpt =
													q.options?.find(
														(opt: any) =>
															opt.isCorrect,
													);
												if (answerKeyOpt) {
													try {
														const pattern =
															JSON.parse(
																answerKeyOpt.optionText,
															);
														return pattern.map(
															(
																pair: string[],
																i: number,
															) => {
																const leftOpt =
																	q.options.find(
																		(
																			o: any,
																		) =>
																			o.id ===
																			pair[0],
																	);
																const rightOpt =
																	q.options.find(
																		(
																			o: any,
																		) =>
																			o.id ===
																			pair[1],
																	);
																return (
																	<div
																		key={i}
																		className="flex items-center p-2 rounded-lg border border-base-200 bg-base-100/50 text-sm"
																	>
																		<span className="flex-1 text-center font-medium">
																			{leftOpt?.optionText ||
																				"?"}
																		</span>
																		<LinkIcon className="w-4 h-4 text-base-content/30 mx-2 shrink-0" />
																		<span className="flex-1 text-center font-medium">
																			{rightOpt?.optionText ||
																				"?"}
																		</span>
																	</div>
																);
															},
														);
													} catch (e) {}
												}
												return null;
											})()}
										</div>
									) : q.type === "TOPOLOGY" ? (
										<div className="p-3 rounded-lg border bg-info/10 border-info/30 text-info-content text-sm flex items-center gap-2">
											<div className="badge badge-info badge-sm">
												Kunci Jawaban Topologi
											</div>
											<span className="flex-1 font-mono">
												Tersimpan (Buka edit untuk
												melihat)
											</span>
											<Network className="w-4 h-4 shrink-0" />
										</div>
									) : (
										// Untuk COMMAND_TYPING / CALCULATION_INPUT (Tipe Isian)
										<div className="p-3 rounded-lg border bg-success/10 border-success/30 text-success-content text-sm flex items-center gap-2">
											<div className="badge badge-success badge-sm">
												Kunci Jawaban
											</div>
											<span className="flex-1 font-mono">
												{q.options?.[0]?.optionText ||
													"-"}
											</span>
											<CheckCircle2 className="w-4 h-4 shrink-0" />
										</div>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Modal Form */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box max-w-3xl bg-base-100">
						<h3 className="font-black text-xl mb-4 pb-2 border-b border-base-200 text-base-content">
							{editingId ? "Edit Soal" : "Tambah Soal Baru"}
						</h3>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4"
						>
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
										<option value="MULTIPLE_CHOICE">
											Pilihan Ganda
										</option>
										<option value="COMMAND_TYPING">
											Ketik Perintah (CLI)
										</option>
										<option value="CALCULATION_INPUT">
											Input Kalkulasi/Angka
										</option>
										<option value="MATCHING">
											Menjodohkan (Matching)
										</option>
										<option value="IMAGE_LABELING">
											Label Gambar (Drag & Drop)
										</option>
										<option value="SORTING">
											Urutkan Item (Sorting)
										</option>
										<option value="TOPOLOGY">
											Topologi Jaringan (Canvas)
										</option>
									</select>
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
								<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
									{optionFields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-3"
										>
											<div className="pt-3">
												<input
													type="radio"
													name="correctAnswer"
													className="radio radio-success radio-sm"
													checked={field.isCorrect}
													onChange={() =>
														setCorrectAnswer(index)
													}
												/>
											</div>
											<div className="flex-1">
												<input
													{...register(
														`options.${index}.optionText` as const,
													)}
													className={`input input-bordered w-full ${field.isCorrect ? "border-success" : ""}`}
													placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
												/>
												{errors.options?.[index]
													?.optionText && (
													<span className="text-error text-xs mt-1 block">
														{
															errors.options[
																index
															]?.optionText
																?.message
														}
													</span>
												)}
											</div>
											{optionFields.length > 2 && (
												<button
													type="button"
													onClick={() =>
														removeOption(index)
													}
													className="btn btn-square btn-ghost text-error"
												>
													<Trash2 className="w-5 h-5" />
												</button>
											)}
										</div>
									))}

									<button
										type="button"
										onClick={() =>
											appendOption({
												optionText: "",
												isCorrect: false,
											})
										}
										className="btn btn-outline btn-sm w-full mt-2 border-dashed"
										disabled={optionFields.length >= 5}
									>
										<Plus className="w-4 h-4" /> Tambah Opsi
										Lainnya
									</button>
								</div>
							) : selectedType === "MATCHING" ? (
								<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
									<div className="grid grid-cols-2 gap-4 mb-2 px-1">
										<span className="text-xs font-bold text-base-content/70 text-center">
											Sisi Kiri (Pertanyaan)
										</span>
										<span className="text-xs font-bold text-base-content/70 text-center">
											Sisi Kanan (Jawaban)
										</span>
									</div>
									{pairFields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-2"
										>
											<div className="flex-1">
												<input
													{...register(
														`matchingPairs.${index}.left` as const,
													)}
													className="input input-bordered w-full input-sm md:input-md"
													placeholder="Teks Kiri..."
												/>
												{errors.matchingPairs?.[index]
													?.left && (
													<span className="text-error text-xs mt-1 block">
														{
															errors
																.matchingPairs[
																index
															]?.left?.message
														}
													</span>
												)}
											</div>
											<div className="pt-2 md:pt-3">
												<LinkIcon className="w-4 h-4 text-base-content/30" />
											</div>
											<div className="flex-1">
												<input
													{...register(
														`matchingPairs.${index}.right` as const,
													)}
													className="input input-bordered w-full input-sm md:input-md"
													placeholder="Teks Kanan Pasangan..."
												/>
												{errors.matchingPairs?.[index]
													?.right && (
													<span className="text-error text-xs mt-1 block">
														{
															errors
																.matchingPairs[
																index
															]?.right?.message
														}
													</span>
												)}
											</div>
											{pairFields.length > 2 && (
												<button
													type="button"
													onClick={() =>
														removePair(index)
													}
													className="btn btn-square btn-sm md:btn-md btn-ghost text-error"
												>
													<Trash2 className="w-4 h-4 md:w-5 md:h-5" />
												</button>
											)}
										</div>
									))}

									<button
										type="button"
										onClick={() =>
											appendPair({ left: "", right: "" })
										}
										className="btn btn-outline btn-sm w-full mt-2 border-dashed"
										disabled={pairFields.length >= 8}
									>
										<Plus className="w-4 h-4" /> Tambah
										Pasangan Baru
									</button>
								</div>
							) : selectedType === "IMAGE_LABELING" ||
							  selectedType === "SORTING" ? (
								<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
									<div className="mb-2 px-1">
										<span className="text-xs font-bold text-base-content/70">
											Daftar Label (Susun sesuai urutan
											yang benar dari Atas ke Bawah)
										</span>
									</div>
									{labelFields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-center gap-2"
										>
											<div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center font-bold text-xs">
												{index + 1}
											</div>
											<div className="flex-1">
												<input
													{...register(
														`imageLabels.${index}.value` as const,
													)}
													className="input input-bordered w-full input-sm md:input-md"
													placeholder={`Label ${index + 1}...`}
												/>
												{errors.imageLabels?.[index]
													?.value && (
													<span className="text-error text-xs mt-1 block">
														{
															errors.imageLabels[
																index
															]?.value?.message
														}
													</span>
												)}
											</div>
											{labelFields.length > 2 && (
												<button
													type="button"
													onClick={() =>
														removeLabel(index)
													}
													className="btn btn-square btn-sm md:btn-md btn-ghost text-error"
												>
													<Trash2 className="w-4 h-4 md:w-5 md:h-5" />
												</button>
											)}
										</div>
									))}

									<button
										type="button"
										onClick={() =>
											appendLabel({ value: "" })
										}
										className="btn btn-outline btn-sm w-full mt-2 border-dashed"
										disabled={labelFields.length >= 10}
									>
										<Plus className="w-4 h-4" /> Tambah
										Label Baru
									</button>
								</div>
							) : selectedType === "TOPOLOGY" ? (
								<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
									<div className="mb-2 px-1">
										<span className="text-xs font-bold text-base-content/70">
											Builder Topologi (Susun perangkat
											dan tarik kabel sebagai jawaban
											benar)
										</span>
									</div>
									<TopologyEditor
										nodes={currentTopologyNodes || []}
										edges={currentTopologyEdges || []}
										onChange={(nodes, edges) => {
											setValue("topologyNodes", nodes);
											setValue("topologyEdges", edges);
										}}
									/>
									{errors.topologyNodes && (
										<span className="text-error text-xs mt-1 block">
											{errors.topologyNodes.message}
										</span>
									)}
								</div>
							) : (
								<div className="bg-success/5 p-4 rounded-xl border border-success/20">
									<label className="label pt-0">
										<span className="label-text font-bold text-success-content">
											Kunci Jawaban Tepat
										</span>
									</label>
									<input
										{...register(
											`options.0.optionText` as const,
										)}
										className="input input-bordered w-full border-success font-mono"
										placeholder={
											selectedType === "COMMAND_TYPING"
												? "Contoh: ping 192.168.1.1"
												: "Contoh: 62"
										}
									/>
									{errors.options?.[0]?.optionText && (
										<span className="text-error text-xs mt-1 block">
											{
												errors.options[0]?.optionText
													?.message
											}
										</span>
									)}
									<p className="text-xs text-base-content/50 mt-2">
										*Jawaban mahasiswa harus sama persis
										(huruf besar/kecil diabaikan)
									</p>
								</div>
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
									onClick={closeModal}
									className="btn btn-ghost"
								>
									Batal
								</button>
								<button
									type="submit"
									className="btn btn-primary px-8"
									disabled={isCreating || isUpdating}
								>
									{isCreating || isUpdating ? (
										<span className="loading loading-spinner"></span>
									) : (
										"Simpan Soal"
									)}
								</button>
							</div>
						</form>
					</div>
					<div
						className="modal-backdrop bg-base-300/80"
						onClick={closeModal}
					></div>
				</div>
			)}
		</div>
	);
}
