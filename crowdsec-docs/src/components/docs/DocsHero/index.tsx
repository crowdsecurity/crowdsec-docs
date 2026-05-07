import styles from "./index.module.css";

type Props = {
	title: string;
	tagline?: string;
	ctaLabel?: string;
	ctaHref?: string;
};

export default function DocsHero({ title, tagline, ctaLabel, ctaHref }: Props) {
	return (
		<div className={styles.hero}>
			<div className={styles.glyph} aria-hidden="true">
				C
			</div>
			<h1 className={styles.title}>{title}</h1>
			{tagline && <p className={styles.tagline}>{tagline}</p>}
			{ctaLabel && ctaHref && (
				<a href={ctaHref} className={styles.cta}>
					{ctaLabel} →
				</a>
			)}
		</div>
	);
}
