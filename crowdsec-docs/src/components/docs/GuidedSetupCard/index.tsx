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
		<div
			style={{
				position: "relative",
				padding: "24px 28px",
				borderRadius: 14,
				background: "var(--cs-surface)",
				border: "1px solid var(--cs-border)",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				gap: 24,
				margin: "28px 0",
				flexWrap: "wrap",
			}}
		>
			{/* Corner glow */}
			<div
				style={{
					position: "absolute",
					top: -60,
					left: -60,
					width: 220,
					height: 220,
					borderRadius: "50%",
					background: "var(--cs-violet)",
					filter: "blur(80px)",
					opacity: 0.1,
					pointerEvents: "none",
				}}
				aria-hidden="true"
			/>

			{/* Icon */}
			<div
				style={{
					width: 56,
					height: 56,
					borderRadius: 14,
					background: "color-mix(in srgb, var(--cs-violet) 14%, transparent)",
					border: "1px solid color-mix(in srgb, var(--cs-violet) 30%, transparent)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					color: "var(--cs-violet)",
				}}
			>
				<CIcon icon={cilCompass} style={{ width: 26, height: 26 }} />
			</div>

			{/* Text */}
			<div style={{ flex: 1, minWidth: 200 }}>
				<div
					style={{
						fontSize: 17,
						fontWeight: 600,
						color: "var(--cs-ink)",
						marginBottom: 4,
					}}
				>
					{title}
				</div>
				<div style={{ fontSize: 13.5, color: "var(--cs-ink-dim)" }}>{desc}</div>
			</div>

			{/* Actions */}
			<div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
				<a
					href={primaryCta.href}
					style={{
						padding: "10px 16px",
						borderRadius: 9,
						background: "var(--cs-violet)",
						color: "var(--cs-btn-text)",
						fontWeight: 600,
						fontSize: 13.5,
						textDecoration: "none",
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						boxShadow: "0 8px 24px color-mix(in srgb, var(--cs-violet) 30%, transparent)",
					}}
				>
					<CIcon icon={cilCompass} style={{ width: 14, height: 14 }} />
					{primaryCta.label}
				</a>
				{secondaryCta && (
					<a
						href={secondaryCta.href}
						style={{
							padding: "10px 16px",
							borderRadius: 9,
							background: "var(--cs-surface-2)",
							color: "var(--cs-ink)",
							fontWeight: 600,
							fontSize: 13.5,
							border: "1px solid var(--cs-border-hi)",
							textDecoration: "none",
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<CIcon icon={cilBolt} style={{ width: 14, height: 14 }} />
						{secondaryCta.label}
					</a>
				)}
			</div>
		</div>
	);
}
