import { cilBolt, cilCompass } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";

type Cta = { label: string; href: string };

type Props = {
	title: string;
	desc: string;
	primaryCta: Cta;
	secondaryCta?: Cta;
};

export default function GuidedSetupCard({ title, desc, primaryCta, secondaryCta }: Props) {
	return (
		<div className="relative py-6 px-7 rounded-[14px] bg-cs-surface border border-cs-border overflow-hidden flex items-center gap-6 my-7 flex-wrap">
			{/* Corner glow */}
			<div
				className="absolute -top-[60px] -left-[60px] w-[220px] h-[220px] rounded-full blur-[80px] opacity-10 pointer-events-none"
				style={{ background: "var(--cs-violet)" }}
				aria-hidden="true"
			/>

			{/* Icon */}
			<div
				className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
				style={{
					background: "color-mix(in srgb, var(--cs-violet) 14%, transparent)",
					border: "1px solid color-mix(in srgb, var(--cs-violet) 30%, transparent)",
					color: "var(--cs-violet)",
				}}
			>
				<CIcon icon={cilCompass} style={{ width: 26, height: 26 }} />
			</div>

			{/* Text */}
			<div className="flex-1 min-w-[200px]">
				<div className="text-[17px] font-semibold text-cs-ink mb-1">{title}</div>
				<div className="text-[13.5px] text-cs-ink-dim">{desc}</div>
			</div>

			{/* Actions */}
			<div className="flex gap-[10px] flex-wrap shrink-0">
				<a
					href={primaryCta.href}
					className="py-[10px] px-4 rounded-[9px] bg-cs-violet text-cs-btn-text font-semibold text-[13.5px] no-underline inline-flex items-center gap-2"
					style={{ boxShadow: "0 8px 24px color-mix(in srgb, var(--cs-violet) 30%, transparent)" }}
				>
					<CIcon icon={cilCompass} style={{ width: 14, height: 14 }} />
					{primaryCta.label}
				</a>
				{secondaryCta && (
					<a
						href={secondaryCta.href}
						className="py-[10px] px-4 rounded-[9px] bg-cs-surface-2 text-cs-ink font-semibold text-[13.5px] border border-cs-border-hi no-underline inline-flex items-center gap-2"
					>
						<CIcon icon={cilBolt} style={{ width: 14, height: 14 }} />
						{secondaryCta.label}
					</a>
				)}
			</div>
		</div>
	);
}
