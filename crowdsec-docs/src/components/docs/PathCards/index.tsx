import React from "react";

type Props = {
	children: React.ReactNode;
};

export default function PathCards({ children }: Props) {
	return <div className="grid grid-cols-3 max-[800px]:grid-cols-2 max-[540px]:grid-cols-1 gap-[18px] my-2 mb-6">{children}</div>;
}
