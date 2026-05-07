type Props = {
	title: string;
	tagline?: string;
	ctaLabel?: string;
	ctaHref?: string;
};

export default function DocsHero({ title, tagline, ctaLabel, ctaHref }: Props) {
	return (
		<div className="flex flex-col items-start gap-4 pt-12 pb-10 max-w-[760px] md:pt-8 md:pb-6">
			<div
				className="w-14 h-14 rounded-[14px] bg-cs-orange-soft border border-[color-mix(in_srgb,var(--cs-orange)_30%,transparent)] flex items-center justify-center text-cs-orange text-[26px] font-extrabold font-cs-sans shrink-0"
				aria-hidden="true"
			>
				C
			</div>
			<h1 className="text-[44px] md:text-[32px] font-bold tracking-[-0.025em] leading-[1.1] text-cs-ink m-0">{title}</h1>
			{tagline && <p className="text-[17px] text-cs-ink-dim leading-relaxed max-w-[580px] m-0">{tagline}</p>}
			{ctaLabel && ctaHref && (
				<a
					href={ctaHref}
					className="inline-flex items-center gap-2 py-[10px] px-[22px] rounded-lg bg-cs-orange text-[#0a1120] font-semibold text-sm no-underline border-none cursor-pointer transition-[opacity,transform] duration-150 hover:opacity-[0.88] hover:-translate-y-px hover:no-underline hover:text-[#0a1120]"
				>
					{ctaLabel} →
				</a>
			)}
		</div>
	);
}
