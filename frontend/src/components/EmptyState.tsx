import type { ReactNode } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@/utils/cn"; 

interface EmptyStateProps {
	icon?: ReactNode;
	title?: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title = "Tidak ada data",
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center px-4 py-12 text-center",
				className,
			)}
		>
			<div className="mb-4 text-muted-foreground">
				{icon ?? <IconInfoCircle size={48} />}
			</div>
			<h3 className="mb-1 text-lg font-semibold text-foreground">
				{title}
			</h3>
			{description && (
				<p className="mb-4 max-w-sm text-sm text-muted-foreground">
					{description}
				</p>
			)}
			{action && <div>{action}</div>}
		</div>
	);
}
