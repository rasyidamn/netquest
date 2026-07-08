import React, { memo, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { 
	Monitor, Laptop, Smartphone, Server, 
	Network, Router as RouterIcon, Wifi, Share2, 
	Cloud, HardDrive, Cpu
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
	pc: <Monitor className="w-8 h-8 text-cyan-400" />,
	laptop: <Laptop className="w-8 h-8 text-blue-400" />,
	smartphone: <Smartphone className="w-8 h-8 text-sky-400" />,
	server: <Server className="w-8 h-8 text-fuchsia-400" />,
	
	switch: <Network className="w-8 h-8 text-emerald-400" />,
	router: <RouterIcon className="w-8 h-8 text-amber-400" />,
	wireless: <Wifi className="w-8 h-8 text-lime-400" />,
	hub: <Share2 className="w-8 h-8 text-orange-400" />,
	
	cloud: <Cloud className="w-8 h-8 text-slate-200" />,
	modem: <HardDrive className="w-8 h-8 text-violet-400" />,
	
	default: <Cpu className="w-8 h-8 text-slate-400" />,
};

export const NetworkNode = memo(({ id, data, selected }: NodeProps) => {
	const deviceType = (data.deviceType as string) || "default";
	const label = (data.label as string) || "Device";
	const isReadOnly = data.isReadOnly === true;
	const icon = iconMap[deviceType] || iconMap["default"];

	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(label);
	const { setNodes } = useReactFlow();

	const handleDoubleClick = () => {
		if (!isReadOnly) {
			setIsEditing(true);
			setEditValue(label);
		}
	};

	const handleSave = () => {
		setIsEditing(false);
		if (editValue.trim() !== label) {
			setNodes((nds) => 
				nds.map((n) => 
					n.id === id ? { ...n, data: { ...n.data, label: editValue.trim() || label } } : n
				)
			);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSave();
		if (e.key === "Escape") {
			setIsEditing(false);
			setEditValue(label);
		}
	};

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

			<div 
				className="mt-3 text-xs font-semibold tracking-wider text-slate-200 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-700/50 whitespace-nowrap min-w-[60px] text-center cursor-text"
				onDoubleClick={handleDoubleClick}
				title={isReadOnly ? "" : "Double-click to edit"}
			>
				{isEditing ? (
					<input
						type="text"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onBlur={handleSave}
						onKeyDown={handleKeyDown}
						autoFocus
						className="bg-transparent border-b border-cyan-400 outline-none text-center text-cyan-400 w-full"
					/>
				) : (
					label
				)}
			</div>
		</div>
	);
});

NetworkNode.displayName = "NetworkNode";
