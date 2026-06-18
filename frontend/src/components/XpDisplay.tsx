function XpDisplay({ xpValue }: { xpValue: number | string }) {
	return (
		<div>
			<p className="font-bold text-xl">
				{xpValue} <span className="text-secondary">XP</span>
			</p>
		</div>
	);
}

export default XpDisplay;
