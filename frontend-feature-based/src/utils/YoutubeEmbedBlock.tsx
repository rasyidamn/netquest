import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { PlayIcon, ExternalLink } from "lucide-react";

export const YoutubeEmbedBlock = createReactBlockSpec(
  {
    type: "youtubeEmbed",
    propSchema: {
      ...defaultProps,
      url: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const getVideoId = (url: string) => {
        const match = url.match(
          /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
        );
        return match ? match[1] : null;
      };

      const url = props.block.props.url;
      const videoId = getVideoId(url);
      const isReadOnly = !props.editor.isEditable;

      if (!videoId) {
        // Mode edit: tampilkan input untuk memasukkan URL
        if (!isReadOnly) {
          return (
            <input
              className="input input-bordered w-full"
              placeholder="Tempel link YouTube di sini..."
              onBlur={(e) =>
                props.editor.updateBlock(props.block, {
                  props: { url: e.target.value },
                })
              }
            />
          );
        }
        return null;
      }

      // URL canonical YouTube untuk ditampilkan sebagai sumber
      const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

      return (
        <div style={{ width: "100%" }}>
          {/* Wrapper video dengan aspect ratio 16:9 */}
          <div style={{ position: "relative", paddingBottom: "56.25%", width: "100%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              allowFullScreen
              title="YouTube video"
            />
          </div>

          {/* Sumber link — hanya tampil di mode baca (TheoryViewer mahasiswa) */}
          {isReadOnly && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                opacity: 0.65,
              }}
            >
              <ExternalLink size={12} />
              <span>Sumber:</span>
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "oklch(var(--p))",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                {canonicalUrl}
              </a>
            </div>
          )}
        </div>
      );
    },
  }
);

export const insertYoutubeEmbed = (editor: any) => ({
  title: "YouTube Embed",
  subtext: "Sisipkan video dari YouTube",
  aliases: ["youtube", "video", "embed", "yt"],
  group: "Media",
  icon: <PlayIcon size={18} />,
  onItemClick: () => {
    // Cari posisi block saat ini (tempat cursor berada)
    const currentBlock = editor.getTextCursorPosition().block;

    editor.insertBlocks(
      [
        {
          type: "youtubeEmbed",
          props: { url: "" },
        },
      ],
      currentBlock,
      "after"
    );
  },
});