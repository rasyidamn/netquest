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
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Link } from "lucide-react";
import clsx from "clsx";

interface SortableMatchItemProps {
	id: string;
	text: string;
	disabled?: boolean;
}

function SortableMatchItem({ id, text, disabled }: SortableMatchItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={clsx(
				"flex items-center justify-between p-3 mb-2 bg-base-100 rounded-xl border-2 transition-colors min-h-[4rem]",
				isDragging ? "border-secondary shadow-lg shadow-secondary/20 z-10 opacity-90" : "border-base-300",
				disabled ? "opacity-70" : "hover:border-secondary/50"
			)}
		>
			<span className="font-medium text-sm md:text-base select-none px-2 text-right w-full">{text}</span>
			<div
				{...attributes}
				{...listeners}
				className={clsx(
					"shrink-0 p-1.5 ml-2 rounded-lg text-base-content/30 transition-colors",
					disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:bg-base-200 hover:text-secondary"
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
	const answerKeyOpt = options.find(opt => {
		try { JSON.parse(opt.optionText); return true; } catch { return false; }
	});

	let leftItems: Option[] = [];
	let initialRightItems: Option[] = [];

	if (answerKeyOpt) {
		try {
			const pairs = JSON.parse(answerKeyOpt.optionText) as string[][];
			pairs.forEach(pair => {
				const leftOpt = options.find(o => o.id === pair[0]);
				const rightOpt = options.find(o => o.id === pair[1]);
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
					const pair = savedPairs.find(p => p[0] === left.id);
					if (pair) {
						const rightItem = initialRightItems.find(r => r.id === pair[1]);
						if (rightItem) orderedRight.push(rightItem);
					}
				}

				// Add any missing right items
				const missingRight = initialRightItems.filter(
					(item) => !orderedRight.some(r => r.id === item.id)
				);
				
				if (orderedRight.length > 0) {
					setRightItems([...orderedRight, ...missingRight]);
					return;
				}
			} catch (e) {
				console.error("Failed to parse selectedAnswer for matching", e);
			}
		}
		
		setRightItems(initialRightItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, selectedAnswer]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const [currentAnswer, setCurrentAnswer] = useState<string>("");

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setRightItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = arrayMove(items, oldIndex, newIndex);
				
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
			<div className="flex items-center justify-between gap-4">
				{/* LEFT COLUMN (STATIC) */}
				<div className="flex-1 space-y-2">
					{leftItems.map((item) => (
						<div key={item.id} className="flex items-center justify-between p-3 mb-2 bg-base-200/50 rounded-xl border-2 border-base-200 min-h-[4rem]">
							<span className="font-semibold text-sm md:text-base">{item.optionText}</span>
							<Link className="w-5 h-5 text-base-content/20 shrink-0 ml-2" />
						</div>
					))}
				</div>

				{/* CONNECTOR UI */}
				<div className="flex flex-col items-center justify-center gap-2 pb-2">
					{leftItems.map((_, i) => (
						<div key={i} className="flex items-center min-h-[4rem] mb-2">
							<div className="w-8 h-1 bg-base-300 rounded-full" />
						</div>
					))}
				</div>

				{/* RIGHT COLUMN (SORTABLE) */}
				<div className="flex-1">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={rightItems.map((i) => i.id)}
							strategy={verticalListSortingStrategy}
						>
							{rightItems.map((item) => (
								<SortableMatchItem
									key={item.id}
									id={item.id}
									text={item.optionText}
									disabled={disabled}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>
			</div>
			
			<div className="text-center mt-6 text-sm text-base-content/40 font-medium bg-base-200/50 py-2 rounded-lg">
				💡 Tarik item di sisi kanan untuk mencocokkan dengan item di sisi kiri
			</div>

			<div className="flex justify-end mt-6">
				<button
					onClick={handleSubmit}
					disabled={disabled || !currentAnswer}
					className={clsx(
						"btn btn-primary",
						(disabled || !currentAnswer) ? "btn-disabled" : ""
					)}
				>
					Kunci Jawaban
				</button>
			</div>
		</div>
	);
}
