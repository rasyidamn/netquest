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
import { GripVertical } from "lucide-react";
import clsx from "clsx";

interface SortableItemProps {
	id: string;
	text: string;
	disabled?: boolean;
}

function SortableItem({ id, text, disabled }: SortableItemProps) {
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
				"flex items-center gap-4 p-4 mb-3 bg-base-100 rounded-xl border-2 transition-colors",
				isDragging ? "border-primary shadow-lg shadow-primary/20 z-10 opacity-90" : "border-base-300",
				disabled ? "opacity-70" : "hover:border-primary/50"
			)}
		>
			<div
				{...attributes}
				{...listeners}
				className={clsx(
					"shrink-0 p-2 rounded-lg text-base-content/30 transition-colors",
					disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:bg-base-200 hover:text-primary"
				)}
			>
				<GripVertical className="w-5 h-5" />
			</div>
			<span className="font-medium text-lg select-none">{text}</span>
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
			JSON.parse(opt.optionText);
			return false; // It's a JSON string, likely the answer key
		} catch {
			return true; // It's a normal draggable item
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
					(item) => !savedOrderIds.includes(item.id)
				);
				
				if (ordered.length > 0) {
					setItems([...ordered, ...missing]);
					return;
				}
			} catch (e) {
				console.error("Failed to parse selectedAnswer for sorting", e);
			}
		}
		
		setItems(validItems);
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
		})
	);

	const [currentAnswer, setCurrentAnswer] = useState<string>("");

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = arrayMove(items, oldIndex, newIndex);
				
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
					strategy={verticalListSortingStrategy}
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
						(disabled || !currentAnswer) ? "btn-disabled" : ""
					)}
				>
					Kunci Jawaban
				</button>
			</div>
		</div>
	);
}
