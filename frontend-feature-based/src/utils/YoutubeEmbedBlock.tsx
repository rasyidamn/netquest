import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { PlayIcon } from "lucide-react";

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
      const getVideoId = (url) => {
        const match = url.match(
          /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
        );
        return match ? match[1] : null;
      };
      const videoId = getVideoId(props.block.props.url);

      if (!videoId) {
        return (
          <input
            placeholder="Tempel link YouTube di sini..."
            onBlur={(e) =>
              props.editor.updateBlock(props.block, {
                props: { url: e.target.value },
              })
            }
          />
        );
      }

      return (
        <div style={{ position: "relative", paddingBottom: "56.25%", width: "100%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            allowFullScreen
            title="YouTube video"
          />
        </div>
      );
    },
  }
);

export const insertYoutubeEmbed = (editor) => ({
  title: "YouTube Embed",
  subtext: "Sisipkan video dari YouTube",
  aliases: ["youtube", "video", "embed", "yt"],
  group: "Media",
  icon: <PlayIcon size={18} />, // bisa pakai icon dari lucide-react atau react-icons
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