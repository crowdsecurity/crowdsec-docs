import { cilArrowRight, cilCommentSquare, cilTerminal } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import CodeBlock from "@theme/CodeBlock";

const INSTALL_CMD = "npx skills add crowdsecurity/crowdsec-skill";
const REPO_URL = "https://github.com/crowdsecurity/crowdsec-skill";
const ACCENT = "var(--cs-orange)";

const HALVES = [
	{
		icon: cilCommentSquare,
		title: "Ask the docs",
		desc: "Instant answers from these docs — no searching required.",
	},
	{
		icon: cilTerminal,
		title: "Operate CrowdSec",
		desc: "It installs, configures, and debugs CrowdSec with you.",
	},
];

/* Variant B — split card: two value props (ask / operate) over a single install CTA. */
export default function SkillSplitCard() {
	const mix = (pct: number) => `color-mix(in srgb, ${ACCENT} ${pct}%, transparent)`;
	return (
		<div className="mt-5 mx-auto w-full max-w-[560px] bg-cs-surface border border-cs-border-hi rounded-[14px] overflow-hidden relative text-left">
			<div
				className="absolute -top-[50px] -right-[50px] w-40 h-40 rounded-full blur-[56px] opacity-[0.18] pointer-events-none"
				style={{ background: ACCENT }}
				aria-hidden="true"
			/>
			<div className="relative p-[14px] flex flex-col gap-[10px]">
				<div className="flex items-center gap-2">
					<span
						className="w-[6px] h-[6px] rounded-full shrink-0"
						style={{ background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }}
						aria-hidden="true"
					/>
					<span className="font-cs-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>
						New · CrowdSec AI skill
					</span>
					<a
						href={REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold no-underline hover:no-underline"
						style={{ color: ACCENT }}
					>
						GitHub <CIcon icon={cilArrowRight} style={{ width: 11, height: 11 }} aria-hidden="true" />
					</a>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
					{HALVES.map((h) => (
						<div key={h.title} className="flex items-start gap-2">
							<span
								className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center shrink-0 mt-[1px] [&>svg]:w-[13px] [&>svg]:h-[13px]"
								style={{ background: mix(14), color: ACCENT, border: `1px solid ${mix(25)}` }}
							>
								<CIcon icon={h.icon} aria-hidden="true" />
							</span>
							<div className="flex flex-col">
								<span className="text-[13px] font-bold text-cs-ink leading-[1.3]">{h.title}</span>
								<span className="text-[11.5px] text-cs-ink-dim leading-[1.35]">{h.desc}</span>
							</div>
						</div>
					))}
				</div>

				<div className="skill-code">
					<CodeBlock language="bash" className="!mb-0">
						{INSTALL_CMD}
					</CodeBlock>
				</div>
			</div>
		</div>
	);
}
