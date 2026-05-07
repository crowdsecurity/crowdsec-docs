import { createStorageSlot } from "@docusaurus/theme-common";
import React, { useState } from "react";

const storage = createStorageSlot("docusaurus.cookieConsent");

export default function CookieConsent() {
	const [dismissed, setDismissed] = useState(false);
	if (dismissed) return null;

	return (
		<div className="fixed bottom-6 right-6 w-80 rounded-[14px] bg-cs-surface border border-cs-border-hi z-[9999] flex flex-col gap-3.5 p-5 pb-4"
			style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(148,163,184,0.06)" }}
		>
			{/* Eyebrow */}
			<div className="font-cs-mono text-[10px] tracking-[0.18em] uppercase text-cs-orange font-semibold">
				CrowdSec Docs
			</div>

			{/* Title + body */}
			<div>
				<div className="text-sm font-semibold text-cs-ink mb-1.5">
					We use cookies
				</div>
				<p className="m-0 text-[13px] text-cs-ink-dim leading-[1.55]">
					This site uses cookies to help us improve your experience. You can
					accept or decline below.
				</p>
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => {
						storage.set("true");
						window.dispatchEvent(new CustomEvent("cookieConsentAccepted"));
						setDismissed(true);
					}}
					className="flex-1 py-2 px-3 rounded-lg bg-cs-orange text-cs-btn-text font-sans text-[13px] font-semibold border-0 cursor-pointer"
				>
					Accept
				</button>
				<button
					type="button"
					onClick={() => {
						storage.set("false");
						setDismissed(true);
					}}
					className="flex-1 py-2 px-3 rounded-lg bg-cs-surface-2 text-cs-ink-dim font-sans text-[13px] font-semibold border border-cs-border-hi cursor-pointer"
				>
					Decline
				</button>
			</div>
		</div>
	);
}
