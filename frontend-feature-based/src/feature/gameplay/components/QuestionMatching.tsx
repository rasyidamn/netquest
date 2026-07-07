import { useState, useEffect } from "react";
import type { Option } from "@/feature/module/schema/question.schema";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	arraySwap,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Link } from "lucide-react";
import clsx from "clsx";

const noMoveStrategy: SortingStrategy = () => null;

interface SortableMatchItemProps {
	id: string;
	text: string;
	disabled?: boolean;
}

function MatchContentRenderer({ text }: { text: string }) {
	const imgMatch = text.match(/!\[(.*?)\]\((.*?)\)/);
	if (imgMatch) {
		const [, alt, url] = imgMatch;
		const remainingText = text.replace(imgMatch[0], "").trim();
		return (
			<div className="flex flex-col items-center gap-2 w-full p-2">
				<img
					src={url}
					alt={alt || "Matching item"}
					className="w-full max-w-[12rem] h-24 object-cover rounded-lg shadow-sm border border-base-300 bg-base-200 shrink-0"
				/>
				{remainingText && (
					<span className="text-center font-medium w-full text-sm leading-tight">
						{remainingText}
					</span>
				)}
			</div>
		);
	}
	return <span className="font-medium text-sm leading-tight">{text}</span>;
}

function SortableMatchItem({ id, text, disabled }: SortableMatchItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
	} = useSortable({ id, disabled });

	const style = {
		transform: transform ? CSS.Translate.toString(transform) : undefined,
		transition: isDragging ? "none" : transition, // ✅ fix di sini
		zIndex: isDragging ? 50 : isOver ? 10 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={clsx(
				"flex items-center justify-between p-3 bg-base-100 rounded-xl border-2 h-full min-h-[8rem]",
				// jangan pakai transition-all — pisahkan properti yang boleh dianimasikan
				"transition-[border-color,box-shadow,background-color] duration-200",
				isDragging
					? "border-secondary shadow-lg shadow-secondary/20 z-50 opacity-90 scale-[1.02]"
					: "border-base-300",
				!isDragging && isOver
					? "ring-2 ring-primary border-primary shadow-md bg-primary/5"
					: "",
				disabled ? "opacity-70" : "hover:border-secondary/50",
			)}
		>
			<div className="font-medium text-sm md:text-base select-none px-2 flex justify-center items-center w-full min-w-0 h-full">
				<MatchContentRenderer text={text} />
			</div>
			<div
				{...attributes}
				{...listeners}
				className={clsx(
					"shrink-0 p-1.5 ml-2 rounded-lg text-base-content/30 transition-colors",
					disabled
						? "cursor-not-allowed"
						: "cursor-grab active:cursor-grabbing hover:bg-base-200 hover:text-secondary",
				)}
			>
				<GripVertical className="w-5 h-5" />
			</div>
		</div>
	);
}

interface QuestionMatchingProps {
	options: Option[];
	selectedAnswer: string | null;
	onSelect: (answer: string) => void;
	disabled?: boolean;
}

export function QuestionMatching({
	options,
	selectedAnswer,
	onSelect,
	disabled = false,
}: QuestionMatchingProps) {
	const answerKeyOpt = options.find((opt) => {
		try {
			const parsed = JSON.parse(opt.optionText);
			return Array.isArray(parsed); // Only the answer key is an Array of pairs
		} catch {
			return false;
		}
	});

	let leftItems: Option[] = [];
	let initialRightItems: Option[] = [];

	if (answerKeyOpt) {
		try {
			const pairs = JSON.parse(answerKeyOpt.optionText) as string[][];
			pairs.forEach((pair) => {
				const leftOpt = options.find((o) => o.id === pair[0]);
				const rightOpt = options.find((o) => o.id === pair[1]);
				if (leftOpt) leftItems.push(leftOpt);
				if (rightOpt) initialRightItems.push(rightOpt);
			});
		} catch (e) {
			console.error("Failed to parse answer key pairs", e);
		}
	}

	const [rightItems, setRightItems] = useState<Option[]>([]);

	useEffect(() => {
		if (selectedAnswer) {
			try {
				const savedPairs = JSON.parse(selectedAnswer) as string[][]; // [[leftId, rightId], ...]

				// Reconstruct the right column based on the saved pairs
				const orderedRight: Option[] = [];
				for (const left of leftItems) {
					const pair = savedPairs.find((p) => p[0] === left.id);
					if (pair) {
						const rightItem = initialRightItems.find(
							(r) => r.id === pair[1],
						);
						if (rightItem) orderedRight.push(rightItem);
					}
				}

				// Add any missing right items
				const missingRight = initialRightItems.filter(
					(item) => !orderedRight.some((r) => r.id === item.id),
				);

				if (orderedRight.length > 0) {
					setRightItems([...orderedRight, ...missingRight]);
					return;
				}
			} catch (e) {
				console.error("Failed to parse selectedAnswer for matching", e);
			}
		}

		// Prevent re-shuffling if the items are already initialized for THIS exact question
		const currentIds = rightItems
			.map((i) => i.id)
			.sort()
			.join(",");
		const validIds = initialRightItems
			.map((i) => i.id)
			.sort()
			.join(",");
		if (currentIds === validIds && rightItems.length > 0) {
			return; // Already initialized for this question
		}

		const shuffledRightItems = [...initialRightItems].sort(
			() => Math.random() - 0.5,
		);
		setRightItems(shuffledRightItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, selectedAnswer]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [currentAnswer, setCurrentAnswer] = useState<string>("");

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setRightItems((items) => {
				const oldIndex = items.findIndex(
					(item) => item.id === active.id,
				);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = arraySwap(items, oldIndex, newIndex);

				const pairs = leftItems.map((left, index) => {
					return [left.id, newItems[index]?.id || null];
				});

				setCurrentAnswer(JSON.stringify(pairs));
				return newItems;
			});
		}
	}

	const handleSubmit = () => {
		if (currentAnswer && !disabled) {
			onSelect(currentAnswer);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-8">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={rightItems.map((i) => i.id)}
					strategy={noMoveStrategy}
				>
					<div className="flex flex-col gap-3">
						{leftItems.map((leftItem, index) => {
							const rightItem = rightItems[index];

							return (
								<div
									key={leftItem.id}
									className="flex items-stretch gap-2 md:gap-4 w-full min-h-[8rem]"
								>
									{/* LEFT ITEM (STATIC) */}
									<div className="flex-1 flex items-center justify-between p-3 bg-base-200/50 rounded-xl border-2 border-base-200 w-1/2">
										<div className="font-semibold text-sm md:text-base min-w-0 w-full flex justify-center items-center h-full">
											<MatchContentRenderer
												text={leftItem.optionText}
											/>
										</div>
									</div>

									{/* CONNECTOR UI */}
									<div className="flex flex-col items-center justify-center shrink-0 w-8 md:w-12 relative">
										<div className="absolute top-1/2 left-0 right-0 h-1 bg-base-300 rounded-full -translate-y-1/2" />
										<Link className="w-5 h-5 text-base-content/20 bg-base-100 rounded-full relative z-10" />
									</div>

									{/* RIGHT ITEM (SORTABLE) */}
									<div className="flex-1 w-1/2 flex flex-col">
										{rightItem && (
											<SortableMatchItem
												id={rightItem.id}
												text={rightItem.optionText}
												disabled={disabled}
											/>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</SortableContext>
			</DndContext>

			<div className="text-center mt-6 text-sm text-base-content/40 font-medium bg-base-200/50 py-2 rounded-lg">
				💡 Tarik item di sisi kanan untuk mencocokkan dengan item di
				sisi kiri
			</div>

			<div className="flex justify-end mt-6">
				<button
					onClick={handleSubmit}
					disabled={disabled || !currentAnswer}
					className={clsx(
						"btn btn-primary",
						disabled || !currentAnswer ? "btn-disabled" : "",
					)}
				>
					Kunci Jawaban
				</button>
			</div>
		</div>
	);
}
