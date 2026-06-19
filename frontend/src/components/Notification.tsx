import { IconBell } from "@tabler/icons-react";

export default function Notification() {
	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="p-1 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground text-base-content">
				<IconBell size={20}/>
			</div>
			<ul
				tabIndex={-1}
				className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
			>
				<li>
					<a>Item 1</a>
				</li>
				<li>
					<a>Item 2</a>
				</li>
			</ul>
		</div>
	);
}
