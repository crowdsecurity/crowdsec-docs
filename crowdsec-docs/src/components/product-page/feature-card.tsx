import Link from "@docusaurus/Link";
import React from "react";

export type FeatureCardProps = {
	title: string;
	description: string;
	link: string;
	icon: string;
};

export const FeatureCard = ({ title, description, link, icon }: FeatureCardProps): React.JSX.Element => {
	return (
		<Link
			href={link}
			className="no-underline block h-full border border-cs-border hover:border-[color-mix(in_srgb,var(--cs-orange)_40%,transparent)] rounded-xl p-[18px_18px_20px] bg-cs-surface hover:bg-cs-surface-2 transition-[border-color,background] duration-150 cursor-pointer group"
		>
			<div className="text-[28px] mb-3 leading-none">
				{icon.startsWith("/") ? <img src={icon} alt={title} className="h-8 w-8 border-none" /> : icon}
			</div>
			<div className="text-[14.5px] font-semibold mb-1.5 text-cs-ink group-hover:text-cs-orange transition-colors duration-150">
				{title}
			</div>
			<p className="text-[13px] text-cs-ink-dim m-0 leading-[1.55]">{description}</p>
		</Link>
	);
};

export type IntegrationCardProps = {
	title: string;
	description: string;
	link: string;
	icon: React.ReactNode;
};

export const IntegrationCard = ({ title, description, link, icon }: IntegrationCardProps): React.JSX.Element => {
	return (
		<Link
			href={link}
			className="no-underline flex items-center gap-[14px] border border-cs-border hover:border-[color-mix(in_srgb,var(--cs-orange)_40%,transparent)] rounded-xl py-[14px] px-4 bg-cs-surface hover:bg-cs-surface-2 transition-[border-color,background] duration-150 cursor-pointer group"
		>
			<div className="w-11 h-11 rounded-[10px] shrink-0 bg-[color-mix(in_srgb,var(--cs-orange)_12%,transparent)] border border-[color-mix(in_srgb,var(--cs-orange)_22%,transparent)] flex items-center justify-center text-cs-orange">
				{icon}
			</div>
			<div>
				<div className="text-[14.5px] font-semibold mb-[3px] text-cs-ink group-hover:text-cs-orange transition-colors duration-150">
					{title}
				</div>
				<p className="text-[13px] text-cs-ink-dim m-0">{description}</p>
			</div>
		</Link>
	);
};

export type IntegrationItemProps = {
	title: string;
	link: string;
};

export const IntegrationItem = ({ title, link }: IntegrationItemProps): React.JSX.Element => {
	return (
		<Link
			href={link}
			className="no-underline block border border-cs-border hover:border-[color-mix(in_srgb,var(--cs-orange)_40%,transparent)] rounded-lg py-[10px] px-[14px] bg-cs-surface hover:bg-cs-surface-2 transition-[border-color,background] duration-150 cursor-pointer group"
		>
			<span className="text-[13.5px] font-medium text-cs-ink group-hover:text-cs-orange transition-colors duration-150">{title}</span>
		</Link>
	);
};
