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
import { GripVertical, Target } from "lucide-react";
import clsx from "clsx";

interface SortableLabelProps {
	id: string;
	text: string;
	index: number;
	disabled?: boolean;
}

function SortableLabel({ id, text, index, disabled }: SortableLabelProps) {
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
				"flex items-center gap-3 p-3 mb-2 bg-base-100 rounded-xl border-2 transition-colors",
				isDragging ? "border-accent shadow-lg shadow-accent/20 z-10 opacity-90" : "border-base-300",
				disabled ? "opacity-70" : "hover:border-accent/50"
			)}
		>
			<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 text-base-content/50 font-bold shrink-0">
				{index + 1}
			</div>
			
			<div
				{...attributes}
				{...listeners}
				className={clsx(
					"shrink-0 p-1 rounded-lg text-base-content/30 transition-colors",
					disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:bg-base-200 hover:text-accent"
				)}
			>
				<GripVertical className="w-5 h-5" />
			</div>
			<span className="font-medium text-sm md:text-base select-none">{text}</span>
		</div>
	);
}

interface QuestionImageLabelingProps {
	questionText: string;
	options: Option[];
	selectedAnswer: string | null;
	onSelect: (answer: string) => void;
	disabled?: boolean;
}

export function QuestionImageLabeling({
	questionText,
	options,
	selectedAnswer,
	onSelect,
	disabled = false,
}: QuestionImageLabelingProps) {
	// 1. Extract image URL from markdown syntax if exists: ![alt](url)
	const imgMatch = questionText.match(/!\[.*?\]\((.*?)\)/);
	const imageUrl = imgMatch ? imgMatch[1] : null;

	// Filter out the answer key option
	const validItems = options.filter((opt) => {
		try {
			JSON.parse(opt.optionText);
			return false;
		} catch {
			return true;
		}
	});

	const [items, setItems] = useState<Option[]>([]);

	useEffect(() => {
		if (selectedAnswer) {
			try {
				const savedOrderIds = JSON.parse(selectedAnswer) as string[];
				const ordered = savedOrderIds
					.map((id) => validItems.find((item) => item.id === id))
					.filter((item): item is Option => item !== undefined);

				const missing = validItems.filter(
					(item) => !savedOrderIds.includes(item.id)
				);
				
				if (ordered.length > 0) {
					setItems([...ordered, ...missing]);
					return;
				}
			} catch (e) {
				console.error("Failed to parse selectedAnswer for labeling", e);
			}
		}
		
		setItems(validItems);
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
		<div className="w-full max-w-4xl mx-auto mt-6 flex flex-col md:flex-row gap-6">
			{/* LEFT: IMAGE DISPLAY */}
			<div className="flex-1 bg-base-200/50 rounded-2xl p-4 border border-base-200 flex flex-col items-center justify-center min-h-[16rem]">
				{imageUrl ? (
					<img 
						src={imageUrl} 
						alt="Diagram Jaringan" 
						className="max-w-full max-h-[400px] object-contain rounded-xl shadow-sm"
					/>
				) : (
					<div className="text-center p-8 opacity-50 flex flex-col items-center">
						<Target className="w-12 h-12 mb-3" />
						<p className="font-semibold">Gambar Tidak Ditemukan</p>
						<p className="text-sm">Admin belum menyisipkan URL gambar pada pertanyaan ini.</p>
					</div>
				)}
			</div>

			{/* RIGHT: DRAGGABLE LABELS */}
			<div className="w-full md:w-80 shrink-0 flex flex-col">
				<div className="text-sm font-bold tracking-widest text-base-content/40 uppercase mb-3 px-1">
					Label Zona (Sesuai Nomor)
				</div>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map((i) => i.id)}
						strategy={verticalListSortingStrategy}
					>
						{items.map((item, index) => (
							<SortableLabel
								key={item.id}
								id={item.id}
								text={item.optionText}
								index={index}
								disabled={disabled}
							/>
						))}
					</SortableContext>
				</DndContext>

				<div className="mt-6 flex justify-end">
					<button
						onClick={handleSubmit}
						disabled={disabled || !currentAnswer}
						className={clsx(
							"btn btn-primary w-full",
							(disabled || !currentAnswer) ? "btn-disabled" : ""
						)}
					>
						Kunci Jawaban
					</button>
				</div>
			</div>
		</div>
	);
}
