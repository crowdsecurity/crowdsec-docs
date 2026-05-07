import AdmonitionLayout from "@theme/Admonition/Layout";
import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";
import React from "react";

function PremiumAdmonition(props: { title?: string; children?: React.ReactNode }) {
	return <AdmonitionLayout {...(props as Parameters<typeof AdmonitionLayout>[0])} type="premium" title={props.title ?? "PREMIUM"} />;
}

export default {
	...DefaultAdmonitionTypes,
	premium: PremiumAdmonition,
};
