// Fails if the latest versioned copy (the first entry of versions.json) has
// drifted from docs/ and sidebars.ts. docs/ is the reference: any change made
// there must be copied to the latest version.
//
// Usage: node scripts/check-versioned-docs.mjs (from crowdsec-docs/)

import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import jiti from "jiti";

const root = fileURLToPath(new URL("..", import.meta.url));
const [latest] = JSON.parse(readFileSync(join(root, "versions.json"), "utf8"));

const currentDocs = join(root, "docs");
const versionedDocs = join(root, "versioned_docs", `version-${latest}`);
const versionedSidebars = join(root, "versioned_sidebars", `version-${latest}-sidebars.json`);

function listFiles(dir) {
	return readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((e) => e.isFile())
		.map((e) => relative(dir, join(e.parentPath, e.name)))
		.sort();
}

function showDiff(a, b) {
	spawnSync("diff", ["-u", a, b], { stdio: "inherit" });
}

let failed = false;

// Docs content
const current = new Set(listFiles(currentDocs));
const versioned = new Set(listFiles(versionedDocs));

for (const file of [...new Set([...current, ...versioned])].sort()) {
	if (!versioned.has(file)) {
		console.error(`::error file=crowdsec-docs/docs/${file}::missing from versioned_docs/version-${latest}`);
		failed = true;
	} else if (!current.has(file)) {
		console.error(`::error file=crowdsec-docs/versioned_docs/version-${latest}/${file}::missing from docs`);
		failed = true;
	} else {
		const a = join(currentDocs, file);
		const b = join(versionedDocs, file);
		if (!readFileSync(a).equals(readFileSync(b))) {
			console.error(`::error file=crowdsec-docs/docs/${file}::differs from versioned_docs/version-${latest}/${file}`);
			showDiff(a, b);
			failed = true;
		}
	}
}

// Sidebars: compare as data, the versioned copy is JSON while the current one is TypeScript.
const loadTs = jiti(fileURLToPath(import.meta.url), { interopDefault: true });
const currentSidebars = JSON.parse(JSON.stringify(loadTs(join(root, "sidebars.ts"))));
const latestSidebars = JSON.parse(readFileSync(versionedSidebars, "utf8"));

if (!isDeepStrictEqual(currentSidebars, latestSidebars)) {
	console.error(`::error file=crowdsec-docs/sidebars.ts::differs from versioned_sidebars/version-${latest}-sidebars.json`);
	const tmp = join(root, "node_modules", ".cache", "check-versioned-docs");
	mkdirSync(tmp, { recursive: true });
	const a = join(tmp, "sidebars.json");
	writeFileSync(a, `${JSON.stringify(currentSidebars, null, 2)}\n`);
	showDiff(a, versionedSidebars);
	failed = true;
}

if (failed) {
	console.error(`\nversioned_docs/version-${latest} and its sidebars must stay identical to docs/ and sidebars.ts, which are the reference: copy your change over.`);
	process.exit(1);
}

console.log(`docs/ and sidebars.ts match ${latest}.`);
