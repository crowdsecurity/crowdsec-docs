import React from "react";

type Props = {
	children: React.ReactNode;
	cols?: 2 | 3;
};

export default function DocCardGrid({ children, cols = 3 }: Props) {
	const colsClass = { 2: "grid-cols-2", 3: "grid-cols-3" } as const;
	return <div className={`grid gap-[14px] my-4 mb-6 ${colsClass[cols]}`}>{children}</div>;
}
