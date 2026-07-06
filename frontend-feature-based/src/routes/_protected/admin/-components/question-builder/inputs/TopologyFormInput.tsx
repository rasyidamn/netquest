import { TopologyEditor } from "@/feature/gameplay/components/TopologyEditor";

interface TopologyFormInputProps {
	currentTopologyNodes: any[];
	currentTopologyEdges: any[];
	setValue: any;
	errors: any;
}

export const TopologyFormInput = ({
	currentTopologyNodes,
	currentTopologyEdges,
	setValue,
	errors,
}: TopologyFormInputProps) => {
	return (
		<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
			<div className="mb-2 px-1">
				<span className="text-xs font-bold text-base-content/70">
					Builder Topologi (Susun perangkat dan tarik kabel sebagai jawaban benar)
				</span>
			</div>
			<TopologyEditor
				nodes={currentTopologyNodes || []}
				edges={currentTopologyEdges || []}
				onChange={(nodes, edges) => {
					setValue("topologyNodes", nodes);
					setValue("topologyEdges", edges);
				}}
			/>
			{errors.topologyNodes && (
				<span className="text-error text-xs mt-1 block">
					{errors.topologyNodes.message}
				</span>
			)}
		</div>
	);
};
