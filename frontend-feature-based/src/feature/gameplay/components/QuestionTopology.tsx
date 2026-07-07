import { useState, useCallback, useEffect } from "react";
import {
	ReactFlow,
	Controls,
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
	type Node,
	type Edge,
	type NodeChange,
	type EdgeChange,
	type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NetworkNode } from "./nodes/NetworkNode";

const nodeTypes = {
	networkDevice: NetworkNode,
};

interface QuestionTopologyProps {
	nodes: any;
	onSubmit?: (answer: string) => void;
	disabled?: boolean;
}

export function QuestionTopology({
	nodes: initialNodes,
	onSubmit,
	disabled,
}: QuestionTopologyProps) {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	useEffect(() => {
		let parsedNodes: any[] = [];
		try {
			// Karena isCorrect di-omit oleh backend untuk keamanan (Mahasiswa),
			// kita harus membedakan mana node (array of object) dan mana jawaban/edge (array of string).
			let nodeOptionStr = "";
			
			if (Array.isArray(initialNodes)) {
				for (const opt of initialNodes) {
					try {
						const parsed = JSON.parse(opt.optionText);
						// Cek apakah ini array of object (Nodes) bukan array of string (Edges)
						if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
							nodeOptionStr = opt.optionText;
							break;
						}
					} catch (e) {
						// Abaikan jika bukan JSON valid
					}
				}
			}

			if (nodeOptionStr) {
				parsedNodes = JSON.parse(nodeOptionStr);
			} else if (typeof initialNodes === "string") {
				// Fallback jika dikirim sebagai string langsung
				parsedNodes = JSON.parse(initialNodes);
			}

			if (!Array.isArray(parsedNodes)) parsedNodes = [];
		} catch (e) {
			console.error("Gagal memparsing node topologi:", e);
		}

		// 3. Mapping data agar memiliki struktur valid untuk React Flow dan NetworkNode
		const validNodes = parsedNodes.map((n: any, index: number) => ({
			id: n.id ? String(n.id) : `node_${index}`,
			type: "networkDevice",
			// Memaksa pembuatan objek 'data' agar NetworkNode tidak error
			data: {
				label: n.data?.label || n.label || `Device ${index + 1}`,
				deviceType: n.data?.deviceType || n.deviceType || "default",
				...n.data,
			},
			position: n.position || {
				x: Math.random() * 300 + 50,
				y: Math.random() * 200 + 50,
			},
		}));

		setNodes(validNodes);
		setEdges([]); // Reset kabel saat pindah soal
	}, [initialNodes]);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) =>
			setNodes((nds) => applyNodeChanges(changes, nds)),
		[],
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) =>
			setEdges((eds) => applyEdgeChanges(changes, eds)),
		[],
	);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[],
	);

	const handleFinalSubmit = () => {
		if (onSubmit) {
			const formattedEdges = edges.map((e) => {
				const sourceFirst = e.source < e.target;
				return sourceFirst
					? `${e.source}-${e.target}`
					: `${e.target}-${e.source}`;
			});
			// Mengirimkan array of strings: ["pc1-switch1", "router1-switch1"]
			onSubmit(JSON.stringify(formattedEdges));
		}
	};

	return (
		<div className="w-full">
			<div className="text-base-content/80 text-sm mb-4 bg-info/10 p-4 rounded-xl border border-info/20">
				Tarik (Drag) perangkat untuk merapikan, dan hubungkan antar
				perangkat.
			</div>

			<div
				style={{
					height: "500px",
					width: "100%",
					borderRadius: "0.75rem",
					overflow: "hidden",
				}}
				className="border border-slate-700 shadow-2xl bg-[#0f172a]"
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={disabled ? undefined : onNodesChange}
					onEdgesChange={disabled ? undefined : onEdgesChange}
					onConnect={disabled ? undefined : onConnect}
					fitView
				>
					<Background />
					<Controls showInteractive={false} />
				</ReactFlow>
			</div>

			<button
				onClick={handleFinalSubmit}
				disabled={disabled}
				className="btn btn-primary w-full mt-6"
			>
				{disabled ? (
					<span className="loading loading-spinner"></span>
				) : (
					"Kunci Jawaban Topologi"
				)}
			</button>
		</div>
	);
}
