interface TheoryViewerProps {
	content: string;
}

export function TheoryViewer({ content }: TheoryViewerProps) {
	return (
		<div
			className="prose prose-base max-w-none text-base-content md:prose-lg"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}