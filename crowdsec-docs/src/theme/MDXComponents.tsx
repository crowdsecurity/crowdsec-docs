import AccessCard from "@site/src/components/docs/AccessCard";
import ChallengeGrid from "@site/src/components/docs/ChallengeGrid";
import ConsoleMockup from "@site/src/components/docs/ConsoleMockup";
import DocCard from "@site/src/components/docs/DocCard";
import DocCardGrid from "@site/src/components/docs/DocCardGrid";
import DocsHero from "@site/src/components/docs/DocsHero";
import GuidedSetupCard from "@site/src/components/docs/GuidedSetupCard";
import PathCard from "@site/src/components/docs/PathCard";
import PathCards from "@site/src/components/docs/PathCards";
import Pill from "@site/src/components/docs/Pill";
import PopularChips from "@site/src/components/docs/PopularChips";
import PromoCard from "@site/src/components/docs/PromoCard";
import QuickStrip from "@site/src/components/docs/QuickStrip";
import RunningStrip from "@site/src/components/docs/RunningStrip";
import MDXComponents from "@theme-original/MDXComponents";
import React from "react";

/* Thin table wrapper — adds .cs-table-wrap border-radius treatment */
function TableWrapper({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
	return (
		<div className="cs-table-wrap">
			<table {...props}>{children}</table>
		</div>
	);
}

export default {
	...MDXComponents,
	table: TableWrapper,
	AccessCard,
	ChallengeGrid,
	ConsoleMockup,
	DocCard,
	DocCardGrid,
	DocsHero,
	GuidedSetupCard,
	PathCard,
	PathCards,
	Pill,
	PopularChips,
	PromoCard,
	QuickStrip,
	RunningStrip,
};
