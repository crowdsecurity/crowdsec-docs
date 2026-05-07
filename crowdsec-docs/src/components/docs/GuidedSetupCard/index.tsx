import React from "react";
import styles from "./index.module.css";

type Cta = { label: string; href: string };

type Props = {
	title: string;
	desc: string;
	primaryCta: Cta;
	secondaryCta?: Cta;
	icon?: React.ReactNode;
};

function DefaultIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}

export default function GuidedSetupCard({ title, desc, primaryCta, secondaryCta, icon }: Props) {
	return (
		<div className={styles.card}>
			<div className={styles.top}>
				<div className={styles.iconWrap}>{icon ?? <DefaultIcon />}</div>
				<div className={styles.title}>{title}</div>
			</div>
			<p className={styles.desc}>{desc}</p>
			<div className={styles.actions}>
				<a href={primaryCta.href} className={styles.primaryCta}>
					{primaryCta.label} →
				</a>
				{secondaryCta && (
					<a href={secondaryCta.href} className={styles.secondaryCta}>
						{secondaryCta.label}
					</a>
				)}
			</div>
		</div>
	);
}
