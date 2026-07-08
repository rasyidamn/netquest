import { useState, useCallback, useEffect } from 'react';
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
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
	Monitor, Laptop, Smartphone, Server, 
	Network, Router as RouterIcon, Wifi, Share2, 
	Cloud, HardDrive, Trash2 
} from 'lucide-react';
import { NetworkNode } from './nodes/NetworkNode';

const nodeTypes = {
  networkDevice: NetworkNode,
};

interface TopologyEditorProps {
	nodes: Node[];
	edges: Edge[];
	onChange?: (nodes: Node[], edges: Edge[]) => void;
	readOnly?: boolean;
}

let id = 0;
const getId = () => `node_${id++}`;

export function TopologyEditor({ nodes: initialNodes, edges: initialEdges, onChange, readOnly = false }: TopologyEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Sync internal state when external initial data changes
  useEffect(() => {
    setNodes(initialNodes.map(n => ({ ...n, data: { ...n.data, isReadOnly: readOnly } })));
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, readOnly]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
      if (onChange) onChange(newNodes, edges);
    },
    [nodes, edges, onChange]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      if (onChange) onChange(nodes, newEdges);
    },
    [nodes, edges, onChange]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      if (onChange) onChange(nodes, newEdges);
    },
    [nodes, edges, onChange]
  );

  const addDevice = (type: string, label: string) => {
    // Hitung berapa banyak device dengan tipe yang sama yang sudah ada
    const deviceCount = nodes.filter(n => n.data?.deviceType === type).length + 1;
    
    const newNode: Node = {
      id: getId(),
      type: 'networkDevice',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: { 
		label: `${label} ${deviceCount}`,
		deviceType: type,
		isReadOnly: readOnly
	  },
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    if (onChange) onChange(newNodes, edges);
  };

  const clearCanvas = () => {
	setNodes([]);
	setEdges([]);
	if (onChange) onChange([], []);
  };

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }} className="border border-slate-700 shadow-2xl bg-[#0f172a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        fitView
        colorMode="dark"
		defaultEdgeOptions={{ 
			type: 'smoothstep', 
			animated: true, 
			style: { stroke: '#22d3ee', strokeWidth: 2 } 
		}}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
		{!readOnly && (
			<Panel position="top-left" className="bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded-lg shadow-xl max-w-[calc(100%-40px)] overflow-x-auto custom-scrollbar">
				<div className="flex gap-2 min-w-max items-center pb-1">
					{/* End Devices */}
					<div className="flex gap-1 items-center bg-slate-900/50 p-1 rounded-md border border-slate-700/50">
						<button type="button" onClick={() => addDevice('pc', 'PC')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Desktop PC">
							<Monitor className="w-3.5 h-3.5 text-cyan-400" /> PC
						</button>
						<button type="button" onClick={() => addDevice('laptop', 'Laptop')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Laptop">
							<Laptop className="w-3.5 h-3.5 text-blue-400" /> Lpt
						</button>
						<button type="button" onClick={() => addDevice('smartphone', 'Phone')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Smartphone">
							<Smartphone className="w-3.5 h-3.5 text-sky-400" /> Phn
						</button>
						<button type="button" onClick={() => addDevice('server', 'Server')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Server">
							<Server className="w-3.5 h-3.5 text-fuchsia-400" /> Srv
						</button>
					</div>

					{/* Intermediate Devices */}
					<div className="flex gap-1 items-center bg-slate-900/50 p-1 rounded-md border border-slate-700/50">
						<button type="button" onClick={() => addDevice('switch', 'Switch')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Switch">
							<Network className="w-3.5 h-3.5 text-emerald-400" /> Sw
						</button>
						<button type="button" onClick={() => addDevice('router', 'Router')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Router">
							<RouterIcon className="w-3.5 h-3.5 text-amber-400" /> Rt
						</button>
						<button type="button" onClick={() => addDevice('wireless', 'AP')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Wireless Router / Access Point">
							<Wifi className="w-3.5 h-3.5 text-lime-400" /> AP
						</button>
						<button type="button" onClick={() => addDevice('hub', 'Hub')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Hub">
							<Share2 className="w-3.5 h-3.5 text-orange-400" /> Hub
						</button>
					</div>

					{/* WAN / ISP */}
					<div className="flex gap-1 items-center bg-slate-900/50 p-1 rounded-md border border-slate-700/50">
						<button type="button" onClick={() => addDevice('cloud', 'Cloud/Internet')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Cloud / Internet">
							<Cloud className="w-3.5 h-3.5 text-slate-200" /> Cld
						</button>
						<button type="button" onClick={() => addDevice('modem', 'Modem')} className="btn btn-xs bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1" title="Modem">
							<HardDrive className="w-3.5 h-3.5 text-violet-400" /> Mdm
						</button>
					</div>

					<button type="button" onClick={clearCanvas} className="btn btn-xs btn-ghost text-rose-400 hover:bg-rose-500/10 ml-2" title="Clear Canvas">
						<Trash2 className="w-3.5 h-3.5" /> Clear
					</button>
				</div>
			</Panel>
		)}
      </ReactFlow>
    </div>
  );
}
