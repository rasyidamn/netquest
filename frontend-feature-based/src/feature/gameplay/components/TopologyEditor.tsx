import React, { useState, useCallback, useEffect } from 'react';
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
import { Monitor, Server, Router as RouterIcon, Trash2 } from 'lucide-react';
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
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

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
    const newNode: Node = {
      id: getId(),
      type: 'networkDevice',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: { 
		label: `${label} ${nodes.length + 1}`,
		deviceType: type
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
			<Panel position="top-left" className="bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded-lg shadow-xl flex gap-2">
			<button type="button" onClick={() => addDevice('pc', 'PC')} className="btn btn-sm bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1">
				<Monitor className="w-4 h-4 text-cyan-400" /> PC
			</button>
			<button type="button" onClick={() => addDevice('switch', 'Switch')} className="btn btn-sm bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1">
				<Server className="w-4 h-4 text-emerald-400" /> Switch
			</button>
			<button type="button" onClick={() => addDevice('router', 'Router')} className="btn btn-sm bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 gap-1">
				<RouterIcon className="w-4 h-4 text-amber-400" /> Router
			</button>
			<button type="button" onClick={clearCanvas} className="btn btn-sm btn-ghost text-rose-400 hover:bg-rose-500/10 ml-4">
				<Trash2 className="w-4 h-4" /> Clear
			</button>
			</Panel>
		)}
      </ReactFlow>
    </div>
  );
}
