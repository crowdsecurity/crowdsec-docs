import React from "react";

export default function AlertIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			style={style}
			aria-hidden="true"
		>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}
