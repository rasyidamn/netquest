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
import { GripVertical } from "lucide-react";
import clsx from "clsx";

const noMoveStrategy: SortingStrategy = () => null;

interface SortableItemProps {
	id: string;
	text: string;
	disabled?: boolean;
}

function SortContentRenderer({ text }: { text: string }) {
	const imgMatch = text.match(/!\[(.*?)\]\((.*?)\)/);
	if (imgMatch) {
		const [, alt, url] = imgMatch;
		const remainingText = text.replace(imgMatch[0], "").trim();
		return (
			<div className="flex flex-col items-center gap-2 w-full p-2">
				<img 
					src={url} 
					alt={alt || "Sorting item"} 
					className="w-full max-w-[12rem] h-24 object-cover rounded-lg shadow-sm border border-base-300 bg-base-200 shrink-0" 
				/>
				{remainingText && <span className="text-center font-medium w-full text-sm leading-tight">{remainingText}</span>}
			</div>
		);
	}
	return <span className="font-medium text-sm leading-tight">{text}</span>;
}

function SortableItem({ id, text, disabled }: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
	} = useSortable({
		id,
		disabled,
	});

	// Use Translate instead of Transform to avoid interfering with Tailwind's scale/transform,
	// or format it safely so it doesn't return "undefined".
	const transformString = transform ? CSS.Translate.toString(transform) : undefined;
	
	const style = {
		transform: transformString,
		transition: isDragging ? undefined : transition,
		zIndex: isDragging ? 50 : isOver ? 10 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="mb-3 relative"
		>
			<div
				className={clsx(
					"group flex items-stretch rounded-2xl overflow-hidden border-2",
					"transition-all duration-200",
					isDragging
						? "border-secondary shadow-lg shadow-secondary/20 scale-[1.02] bg-base-100 opacity-90 z-50"
						: "border-base-200/60 shadow-sm bg-base-100",
					!isDragging && isOver
						? "ring-2 ring-primary border-primary shadow-md bg-primary/5"
						: "",
					disabled
						? "opacity-70 bg-base-200/50"
						: "hover:border-primary/40 hover:shadow-md",
				)}
			>
				<div
					{...attributes}
					{...listeners}
					className={clsx(
						"shrink-0 flex items-center justify-center w-14 transition-colors",
						disabled
							? "cursor-not-allowed text-base-content/20"
							: "cursor-grab active:cursor-grabbing text-base-content/30 hover:bg-base-200 hover:text-primary group-hover:text-base-content/60",
						isDragging ? "bg-primary/10 text-primary" : ""
					)}
				>
					<GripVertical className="w-6 h-6" />
				</div>
				<div className="flex-1 flex items-center p-4 pl-2">
					<SortContentRenderer text={text} />
				</div>
			</div>
		</div>
	);
}

interface QuestionSortingProps {
	options: Option[];
	selectedAnswer: string | null;
	onSelect: (answer: string) => void;
	disabled?: boolean;
}

export function QuestionSorting({
	options,
	selectedAnswer,
	onSelect,
	disabled = false,
}: QuestionSortingProps) {
	// Filter out the answer key option (which is a JSON string)
	const validItems = options.filter((opt) => {
		try {
			const parsed = JSON.parse(opt.optionText);
			// Answer key is always an Array of UUIDs.
			// Normal items like "123" parse to numbers, so they aren't arrays.
			if (Array.isArray(parsed)) {
				return false; // It's an array, meaning it's the answer key
			}
			return true; // Valid JSON but not an array, so it's a normal item
		} catch {
			return true; // Not valid JSON, so it's a normal string item
		}
	});

	const [items, setItems] = useState<Option[]>([]);

	// Initialize items from selectedAnswer or just use validItems
	useEffect(() => {
		if (selectedAnswer) {
			try {
				const savedOrderIds = JSON.parse(selectedAnswer) as string[];
				// Reconstruct the array in the saved order
				const ordered = savedOrderIds
					.map((id) => validItems.find((item) => item.id === id))
					.filter((item): item is Option => item !== undefined);

				// Add any missing validItems that weren't in the saved order
				const missing = validItems.filter(
					(item) => !savedOrderIds.includes(item.id),
				);

				if (ordered.length > 0) {
					setItems([...ordered, ...missing]);
					return;
				}
			} catch (e) {
				console.error("Failed to parse selectedAnswer for sorting", e);
			}
		}

		// Prevent re-shuffling if the items are already initialized for THIS exact question
		// (e.g. if React Query refetches and passes a new options array reference)
		const currentIds = items.map(i => i.id).sort().join(',');
		const validIds = validItems.map(i => i.id).sort().join(',');
		if (currentIds === validIds && items.length > 0) {
			return; // Already initialized for this question
		}

		// Randomize items if there is no previous answer
		const shuffledItems = [...validItems].sort(() => Math.random() - 0.5);
		setItems(shuffledItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, selectedAnswer]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [currentAnswer, setCurrentAnswer] = useState<string>("");

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex(
					(item) => item.id === active.id,
				);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = arraySwap(items, oldIndex, newIndex);

				const newOrderIds = newItems.map((item) => item.id);
				setCurrentAnswer(JSON.stringify(newOrderIds));

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
		<div className="w-full max-w-2xl mx-auto mt-6">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={items.map((i) => i.id)}
					strategy={noMoveStrategy}
				>
					{items.map((item) => (
						<SortableItem
							key={item.id}
							id={item.id}
							text={item.optionText}
							disabled={disabled}
						/>
					))}
				</SortableContext>
			</DndContext>
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
