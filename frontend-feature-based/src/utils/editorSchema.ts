import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { YoutubeEmbedBlock } from "./YoutubeEmbedBlock";

   export const editorSchema = BlockNoteSchema.create({
      blockSpecs: {
         ...defaultBlockSpecs,
         youtubeEmbed: YoutubeEmbedBlock(),
      },
   });