type Chip = { label: string; href: string };

type Props = {
	heading?: string;
	chips: Chip[];
};

export default function PopularChips({ heading = "Popular docs", chips }: Props) {
	return (
		<div className="my-7">
			<div className="font-cs-mono text-[10px] uppercase tracking-[0.14em] text-cs-ink-mute mb-3">{heading}</div>
			<div className="flex flex-wrap gap-2">
				{chips.map((c) => (
					<a
						key={c.href}
						href={c.href}
						className="inline-flex items-center py-[6px] px-[14px] rounded-lg font-cs-mono text-xs text-cs-ink-dim border border-cs-border-hi bg-cs-surface no-underline transition-[border-color,color,background] duration-150 hover:border-cs-orange hover:text-cs-orange hover:bg-cs-orange-soft hover:no-underline"
					>
						{c.label}
					</a>
				))}
			</div>
		</div>
	);
}
