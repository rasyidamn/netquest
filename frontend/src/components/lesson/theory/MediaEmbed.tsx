import { cn } from "@/utils/cn";

interface MediaEmbedProps {
	mediaUrl: string | null | undefined;
	className?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
	const patterns = [
		// youtube.com/watch?v=VIDEO_ID
		/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
		// youtu.be/VIDEO_ID
		/youtu\.be\/([a-zA-Z0-9_-]{11})/,
		// youtube.com/embed/VIDEO_ID
		/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
		// youtube.com/shorts/VIDEO_ID
		/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return `https://www.youtube.com/embed/${match[1]}`;
		}
	}

	return null;
}

function isImageUrl(url: string): boolean {
	return /\.(jpe?g|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

export function MediaEmbed({ mediaUrl, className }: MediaEmbedProps) {
	if (!mediaUrl) {
		return null;
	}

	const youtubeEmbedUrl = getYouTubeEmbedUrl(mediaUrl);

	if (youtubeEmbedUrl) {
		return (
			<div className={cn("overflow-hidden rounded-box", className)}>
				<div className="aspect-video w-full">
					<iframe
						src={youtubeEmbedUrl}
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="h-full w-full"
					/>
				</div>
			</div>
		);
	}

	if (isImageUrl(mediaUrl)) {
		return (
			<div className={cn("overflow-hidden rounded-box", className)}>
				<img
					src={mediaUrl}
					alt="Media materi"
					className="h-auto w-full object-cover"
				/>
			</div>
		);
	}

	// Fallback: render as image anyway
	return (
		<div className={cn("overflow-hidden rounded-box", className)}>
			<img
				src={mediaUrl}
				alt="Media materi"
				className="h-auto w-full object-cover"
			/>
		</div>
	);
}