import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Monitor, Server, Router as RouterIcon, Network } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
	pc: <Monitor className="w-8 h-8 text-cyan-400" />,
	switch: <Server className="w-8 h-8 text-emerald-400" />,
	router: <RouterIcon className="w-8 h-8 text-amber-400" />,
	default: <Network className="w-8 h-8 text-slate-400" />,
};

export const NetworkNode = memo(({ data, selected }: NodeProps) => {
	const deviceType = (data.deviceType as string) || "default";
	const label = (data.label as string) || "Device";
	const icon = iconMap[deviceType] || iconMap["default"];

	return (
		<div
			className={`
        relative flex flex-col items-center justify-center p-4 rounded-xl min-w-[100px]
        backdrop-blur-md bg-[#1a1f2e]/80 border-2 transition-all duration-300
        ${
			selected
				? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105"
				: "border-slate-600/50 hover:border-slate-400 shadow-lg"
		}
      `}
		>
			{/* Handles untuk 4 sisi agar lebih luwes */}
			<Handle type="target" position={Position.Left} id="left-target" />
			<Handle type="source" position={Position.Left} id="left-source" />
			<Handle type="target" position={Position.Right} id="right-target" />
			<Handle type="source" position={Position.Right} id="right-source" />

			{/* Glow Effect di belakang Icon */}
			<div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
				<div
					className="w-12 h-12 rounded-full bg-current blur-xl"
					style={{ color: selected ? "cyan" : "transparent" }}
				></div>
			</div>

			<div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
				{icon}
			</div>

			<div className="mt-3 text-xs font-semibold tracking-wider text-slate-200 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-700/50 whitespace-nowrap">
				{label}
			</div>
		</div>
	);
});

NetworkNode.displayName = "NetworkNode";
