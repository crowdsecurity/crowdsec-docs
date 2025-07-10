import CIcon from "@coreui/icons-react";
import Link from "@docusaurus/Link";
import React from "react";

type Props = {
	title: string;
	description: string;
	link: string;
	// biome-ignore lint/suspicious/noExplicitAny: We need to allow any icon type here, as it can be a React component or an icon from CIcon.
	icon: any;
};

export const HomePageItem = (props: Props): React.JSX.Element => (
	<Link key={props.title} href={props.link} className="border-0 hover:no-underline">
		<div
			className={
				"w-full flex justify-start items-center border border-solid border-gray-100 dark:border-transparent dark:bg-gray-200 flex-row rounded-lg px-2 py-2 gap-2 flex-1 cursor-pointer shadow-md dark:shadow-none ease-in-out duration-300 hover:scale-101 active:scale-99 hover:dark:bg-gray-300"
			}
		>
			<span className="w-12 h-12 rounded-lg inline-flex items-center justify-center border border-solid border-gray-200 dark:bg-gray-50">
				{(!Array.isArray(props.icon) && <props.icon className="icon icon-xl" />) || <CIcon icon={props.icon} size="xl" />}
			</span>

			<div className="flex flex-col">
				<span className={"text-md font-semibold flex-1 text-left text-foreground"}>{props.title}</span>
				{props.description && <p className="text-sm text-left text-foreground/70 mb-0">{props.description}</p>}
			</div>
		</div>
	</Link>
);
