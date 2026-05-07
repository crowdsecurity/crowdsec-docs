import React from "react";

type Props = {
	children: React.ReactNode;
	cols?: 2 | 3;
};

export default function DocCardGrid({ children, cols = 3 }: Props) {
	return <div className={`grid gap-[14px] my-4 mb-6 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>{children}</div>;
}
