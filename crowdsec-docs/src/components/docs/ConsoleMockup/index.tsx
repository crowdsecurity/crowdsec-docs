export default function ConsoleMockup() {
	return (
		<div className="rounded-xl overflow-hidden border border-cs-border-hi bg-cs-surface my-6">
			<div className="flex items-center gap-1.5 py-[10px] px-4 bg-cs-surface-2 border-b border-cs-border">
				<div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
				<div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
				<div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
				<span className="ml-2 font-cs-mono text-[11px] text-cs-ink-mute">app.crowdsec.net — Console</span>
			</div>
			<svg
				className="w-full block"
				viewBox="0 0 800 420"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="CrowdSec Console dashboard preview"
				role="img"
			>
				{/* Background */}
				<rect width="800" height="420" fill="var(--cs-surface)" />

				{/* Left sidebar */}
				<rect x="0" y="0" width="160" height="420" fill="var(--cs-bg)" />
				{/* Logo area */}
				<rect x="12" y="16" width="28" height="28" rx="6" fill="var(--cs-orange)" opacity="0.9" />
				<text x="26" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0A1120">
					C
				</text>
				<rect x="48" y="22" width="80" height="10" rx="3" fill="var(--cs-ink-mute)" opacity="0.5" />
				{/* Nav items */}
				{[60, 90, 120, 150, 180, 210].map((y, i) => (
					<g key={y}>
						<rect x="12" y={y} width="136" height="22" rx="5" fill={i === 1 ? "var(--cs-orange-soft)" : "transparent"} />
						<rect
							x="18"
							y={y + 5}
							width="12"
							height="12"
							rx="3"
							fill={i === 1 ? "var(--cs-orange)" : "var(--cs-ink-mute)"}
							opacity={i === 1 ? 0.9 : 0.4}
						/>
						<rect
							x="36"
							y={y + 7}
							width={[55, 70, 48, 62, 44, 58][i]}
							height="8"
							rx="3"
							fill={i === 1 ? "var(--cs-orange)" : "var(--cs-ink-mute)"}
							opacity={i === 1 ? 0.8 : 0.35}
						/>
					</g>
				))}

				{/* Top bar */}
				<rect x="160" y="0" width="640" height="44" fill="var(--cs-bg-soft)" />
				<rect x="172" y="12" width="200" height="20" rx="5" fill="var(--cs-surface)" />
				<rect x="180" y="18" width="10" height="10" rx="2" fill="var(--cs-ink-mute)" opacity="0.4" />
				<rect x="196" y="20" width="80" height="6" rx="2" fill="var(--cs-ink-mute)" opacity="0.3" />
				<circle cx="748" cy="22" r="14" fill="var(--cs-surface)" />
				<rect x="738" y="16" width="20" height="12" rx="3" fill="var(--cs-violet)" opacity="0.4" />

				{/* Stat cards row */}
				{[
					{ x: 172, label: "Alerts Today", value: "1,284", color: "var(--cs-orange)" },
					{ x: 340, label: "Blocked IPs", value: "3,921", color: "var(--cs-teal)" },
					{ x: 508, label: "Decisions", value: "8,406", color: "var(--cs-violet)" },
				].map((card) => (
					<g key={card.x}>
						<rect
							x={card.x}
							y="56"
							width="150"
							height="72"
							rx="8"
							fill="var(--cs-surface-2)"
							stroke="var(--cs-border)"
							strokeWidth="1"
						/>
						<text x={card.x + 14} y="77" fontSize="9" fill="var(--cs-ink-mute)" fontFamily="monospace">
							{card.label.toUpperCase()}
						</text>
						<text x={card.x + 14} y="104" fontSize="22" fontWeight="700" fill={card.color}>
							{card.value}
						</text>
						{/* Sparkline */}
						<polyline
							points={`${card.x + 90},115 ${card.x + 100},105 ${card.x + 112},108 ${card.x + 122},98 ${card.x + 136},102`}
							fill="none"
							stroke={card.color}
							strokeWidth="1.5"
							opacity="0.6"
						/>
					</g>
				))}

				{/* Main chart area */}
				<rect
					x="172"
					y="140"
					width="390"
					height="220"
					rx="8"
					fill="var(--cs-surface-2)"
					stroke="var(--cs-border)"
					strokeWidth="1"
				/>
				<text x="186" y="160" fontSize="9" fill="var(--cs-ink-mute)" fontFamily="monospace">
					ALERTS OVER TIME
				</text>
				{/* Chart bars */}
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
					const heights = [40, 65, 50, 80, 55, 90, 45, 70, 60, 85, 50, 75];
					return (
						<rect
							key={i}
							x={186 + i * 30}
							y={320 - heights[i]}
							width="18"
							height={heights[i]}
							rx="3"
							fill="var(--cs-orange)"
							opacity={0.25 + (heights[i] / 90) * 0.5}
						/>
					);
				})}
				{/* X-axis labels */}
				{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
					<text key={m} x={195 + i * 30} y="335" fontSize="7" fill="var(--cs-ink-mute)" textAnchor="middle">
						{m}
					</text>
				))}

				{/* Right panel */}
				<rect
					x="574"
					y="140"
					width="214"
					height="220"
					rx="8"
					fill="var(--cs-surface-2)"
					stroke="var(--cs-border)"
					strokeWidth="1"
				/>
				<text x="588" y="160" fontSize="9" fill="var(--cs-ink-mute)" fontFamily="monospace">
					TOP THREATS
				</text>
				{[
					{ label: "SSH Bruteforce", pct: 82, color: "var(--cs-orange)" },
					{ label: "Port Scan", pct: 61, color: "var(--cs-violet)" },
					{ label: "HTTP Flood", pct: 45, color: "var(--cs-teal)" },
					{ label: "CVE Exploit", pct: 34, color: "var(--cs-pink)" },
					{ label: "Credential Stuff", pct: 22, color: "var(--cs-blue)" },
				].map((row, i) => (
					<g key={row.label}>
						<text x="588" y={182 + i * 34} fontSize="9" fill="var(--cs-ink-dim)">
							{row.label}
						</text>
						<rect x="588" y={186 + i * 34} width="166" height="6" rx="3" fill="var(--cs-border)" />
						<rect x="588" y={186 + i * 34} width={(166 * row.pct) / 100} height="6" rx="3" fill={row.color} opacity="0.75" />
					</g>
				))}
			</svg>
		</div>
	);
}
