import { useCodeBlockContext } from "@docusaurus/theme-common/internal";
import CopyButton from "@theme/CodeBlock/Buttons/CopyButton";
import type { Props } from "@theme/CodeBlock/Content";
import OriginalCodeBlockContent from "@theme-original/CodeBlock/Content";
import React from "react";

/* Abbreviated language labels for the chrome pill */
const LANG_LABEL: Record<string, string> = {
	bash: "SH",
	shell: "SH",
	sh: "SH",
	zsh: "SH",
	console: "SH",
	yaml: "YAML",
	yml: "YAML",
	json: "JSON",
	json5: "JSON",
	typescript: "TS",
	tsx: "TSX",
	javascript: "JS",
	jsx: "JSX",
	python: "PY",
	py: "PY",
	go: "GO",
	rust: "RS",
	ruby: "RB",
	php: "PHP",
	diff: "DIFF",
	text: "TEXT",
	plaintext: "TEXT",
	txt: "TEXT",
	sql: "SQL",
	dockerfile: "DOCKER",
	docker: "DOCKER",
	toml: "TOML",
	ini: "INI",
	cfg: "CFG",
	nginx: "NGINX",
	apache: "APACHE",
	css: "CSS",
	scss: "SCSS",
	html: "HTML",
	xml: "XML",
	markdown: "MD",
	mdx: "MDX",
	hcl: "HCL",
	terraform: "HCL",
	powershell: "PS1",
	ps: "PS1",
	kotlin: "KT",
	swift: "SWIFT",
	java: "JAVA",
};

export default function CodeBlockContentWithChrome(props: Props): React.JSX.Element {
	const { metadata } = useCodeBlockContext();
	const lang = (metadata.language ?? "").toLowerCase();
	const langLabel = LANG_LABEL[lang] ?? (lang ? lang.toUpperCase() : "CODE");
	const title = metadata.title;

	return (
		<div className="cs-codeblock-outer">
			{/* ── Chrome bar ── always visible ── */}
			<div className="cs-codeblock-chrome">
				<span className="cs-codeblock-lang">{langLabel}</span>
				{title && <span className="cs-codeblock-title">{title}</span>}
				<CopyButton />
			</div>

			{/* ── Code area (pre + original buttons hidden via CSS) ── */}
			<div className="cs-codeblock-body">
				<OriginalCodeBlockContent {...props} />
			</div>
		</div>
	);
}
