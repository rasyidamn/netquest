import { getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import React from "react";
import { Save, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonApi } from "@/feature/module/api/lessonApi";
import toast from "react-hot-toast";
import type { LessonDetailType } from "@/feature/module/schema/lesson.schema";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems } from "@blocknote/core";
import { insertYoutubeEmbed, YoutubeEmbedBlock } from "@/utils/YoutubeEmbedBlock";

export function LessonEditor({ lesson }: { lesson: LessonDetailType }) {
	const queryClient = useQueryClient();
	
	const initialContent = React.useMemo(() => {
		if (lesson.material?.content) {
			try {
				return JSON.parse(lesson.material.content);
			} catch (e) {
				// Fallback untuk legacy text/html yang belum berbentuk JSON
				return [
					{
						type: "paragraph",
						content: lesson.material.content,
					}
				];
			}
		}
		return undefined; // undefined triggers default empty editor
	}, [lesson.material]);

	const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtubeEmbed: YoutubeEmbedBlock(),
  },
});

	const editor = useCreateBlockNote({
		initialContent: initialContent,
		uploadFile: async (file: File) => {
			// Convert image to Base64
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		},
		schema
	});

	const { mutate: saveMaterial, isPending } = useMutation({
		mutationFn: async (contentJson: string) => {
			return lessonApi.upsertMaterial({
				id: lesson.id,
				content: contentJson,
			});
		},
		onSuccess: () => {
			toast.success("Materi berhasil disimpan!");
			queryClient.invalidateQueries({ queryKey: ["lesson", lesson.id] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Gagal menyimpan materi");
		},
	});

	const handleSave = () => {
		// Dapatkan struktur blok dari editor dan jadikan string JSON
		const contentJson = JSON.stringify(editor.document);
		saveMaterial(contentJson);
	};

	return (
		<div className="flex flex-col h-full rounded-2xl bg-base-100 border border-base-200 overflow-hidden shadow-sm">
			{/* Toolbar Editor */}
			<div className="flex justify-between items-center p-4 border-b border-base-200 bg-base-200/30">
				<div>
					<h3 className="font-bold text-lg">{lesson.title}</h3>
					<p className="text-sm text-base-content/60">Tipe: Teori (Block-Based Editor)</p>
				</div>
				<button 
					onClick={handleSave} 
					disabled={isPending}
					className="btn btn-primary btn-sm px-6"
				>
					{isPending ? (
						<span className="loading loading-spinner loading-xs"></span>
					) : (
						<Save className="w-4 h-4" />
					)}
					Simpan Materi
				</button>
			</div>

			{/* Canvas Editor */}
			<div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-base-100 blocknote-theme-container">
				{/* BlockNote handles its own styling, but we wrap it to give padding */}
				<div className="max-w-4xl mx-auto min-h-[500px]">
					<BlockNoteView editor={editor} slashMenu={false} theme={"dark"}>
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor),
              insertYoutubeEmbed(editor),
            ],
            query
          )
        }
      />
    </BlockNoteView>
				</div>
			</div>
			
			<style dangerouslySetInnerHTML={{__html: `
				/* Penyesuaian tema kustom agar menyatu dengan DaisyUI */
				.blocknote-theme-container {
					font-family: inherit;
				}
				.bn-editor {
					background-color: transparent !important;
				}
				.bn-container[data-theme="dark"] {
					--bn-colors-editor-text: oklch(var(--bc)) !important;
					--bn-colors-editor-background: transparent !important;
				}
			`}} />
		</div>
	);
}
