import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonApi } from "@/feature/module/api/lessonApi";
import toast from "react-hot-toast";

import { questionFormSchema, type QuestionFormValues } from "./schema";
import { QuestionList } from "./QuestionList";
import { QuestionFormModal } from "./QuestionFormModal";

interface QuestionBuilderProps {
	lessonId: string;
	questions: any[];
}

export const QuestionBuilder = ({ lessonId, questions = [] }: QuestionBuilderProps) => {
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
	} = useFieldArray({ control, name: "options" });

	const {
		fields: pairFields,
		append: appendPair,
		remove: removePair,
	} = useFieldArray({ control, name: "matchingPairs" });

	const {
		fields: labelFields,
		append: appendLabel,
		remove: removeLabel,
	} = useFieldArray({ control, name: "imageLabels" });

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value as any;
		setValue("type", newType);

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
		} else if (newType === "SORTING") {
			setValue("imageLabels", [{ value: "" }, { value: "" }]);
		} else if (
			newType === "COMMAND_TYPING" ||
			newType === "CALCULATION_INPUT"
		) {
			setValue("options", [{ optionText: "", isCorrect: true }]);
		} else if (newType === "RAPID_TRUE_FALSE") {
			setValue("options", [
				{ optionText: "Benar", isCorrect: true },
				{ optionText: "Salah", isCorrect: false },
			]);
		} else if (newType === "VISUAL_IDENTIFICATION") {
			setValue("baseImageUrl", "");
			setValue("hotspots", []);
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
			data.type === "SORTING" &&
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
		} else if (
			data.type === "VISUAL_IDENTIFICATION" &&
			data.baseImageUrl &&
			data.hotspots
		) {
			payload.options = [
				{
					optionText: data.baseImageUrl,
					isCorrect: false,
				},
				...data.hotspots.map((h: any) => ({
					optionText: JSON.stringify({ x: h.x, y: h.y }),
					isCorrect: h.isCorrect,
				})),
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
				question.type === "SORTING" &&
				question.options
			) {
				const answerKeyOpt = question.options.find(
					(opt: any) => opt.isCorrect,
				);
				if (answerKeyOpt) {
					try {
						const pattern = JSON.parse(answerKeyOpt.optionText);
						imageLabels = pattern.map((i: number) => {
							const opt = question.options.find(
								(o: any) => o.id === question.advancedOptions[i] || o.optionText === question.advancedOptions[i]
							);
							// Fallback to advancedOptions if option is not found
							const val = opt?.optionText || (question.advancedOptions && question.advancedOptions[i]) || "";
							return { value: val };
						});
					} catch (e) {}
				}
			}
			if (
				question.type === "SORTING" &&
				imageLabels.length === 0
			) {
				imageLabels = [{ value: "" }, { value: "" }];
			}

			let topologyNodes = [];
			let topologyEdges = [];
			if (question.type === "TOPOLOGY" && question.options) {
				const nodesOpt = question.options.find(
					(o: any) => !o.isCorrect,
				);
				const edgesOpt = question.options.find(
					(o: any) => o.isCorrect,
				);
				if (nodesOpt) {
					try {
						topologyNodes = JSON.parse(nodesOpt.optionText);
					} catch (e) {}
				}
				if (edgesOpt) {
					try {
						// Here edges in DB are string array, we need to convert back to edge objects for React Flow
						// But TopologyEditor currently takes nodes and edges. It might have a parsing logic.
						// The original code was saving strings. Wait, original code:
						const edgeStrings = JSON.parse(edgesOpt.optionText);
						topologyEdges = edgeStrings.map((str: string) => {
							const [source, target] = str.split("-");
							return {
								id: `e${source}-${target}`,
								source,
								target,
							};
						});
					} catch (e) {}
				}
			}

			let baseImageUrl = "";
			let hotspots: any[] = [];
			if (question.type === "VISUAL_IDENTIFICATION" && question.options?.length > 0) {
				baseImageUrl = question.options[0].optionText;
				hotspots = question.options.slice(1).map((opt: any) => {
					try {
						const parsed = JSON.parse(opt.optionText);
						return {
							id: opt.id,
							x: parsed.x,
							y: parsed.y,
							isCorrect: opt.isCorrect,
						};
					} catch {
						return { x: 0, y: 0, isCorrect: false };
					}
				});
			}

			reset({
				type: question.type,
				questionText: question.questionText,
				options:
					question.type === "MULTIPLE_CHOICE" ||
					question.type === "COMMAND_TYPING" ||
					question.type === "CALCULATION_INPUT" ||
					question.type === "RAPID_TRUE_FALSE"
						? question.options
						: [],
				matchingPairs,
				imageLabels,
				topologyNodes,
				topologyEdges,
				baseImageUrl,
				hotspots,
			});
		} else {
			setEditingId(null);
			reset({
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
				baseImageUrl: "",
				hotspots: [],
			});
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingId(null);
		reset();
	};

	const setCorrectAnswer = (index: number) => {
		const currentOptions = getValues("options");
		const newOptions = currentOptions.map((opt, i) => ({
			...opt,
			isCorrect: i === index,
		}));
		setValue("options", newOptions);
	};

	return (
		<div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-sm">
			<QuestionList
				questions={questions}
				openModal={openModal}
				deleteMutation={deleteMutation}
				isDeleting={isDeleting}
			/>
			<QuestionFormModal
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				editingId={editingId}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				register={register}
				errors={errors}
				selectedType={selectedType}
				handleTypeChange={handleTypeChange}
				optionFields={optionFields}
				appendOption={appendOption}
				removeOption={removeOption}
				setCorrectAnswer={setCorrectAnswer}
				pairFields={pairFields}
				getValues={getValues}
				setValue={setValue}
				control={control}
				appendPair={appendPair}
				removePair={removePair}
				labelFields={labelFields}
				appendLabel={appendLabel}
				removeLabel={removeLabel}
				currentTopologyNodes={currentTopologyNodes}
				currentTopologyEdges={currentTopologyEdges}
				isCreating={isCreating}
				isUpdating={isUpdating}
			/>
		</div>
	);
};
