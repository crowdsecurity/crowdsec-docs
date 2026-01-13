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
	<Link key={props.title} href={props.link} className="border-0 hover:no-underline group">
		<div
			className={
				"w-full h-full flex justify-start items-center border border-solid border-gray-200 dark:border-gray-300 dark:bg-gray-200 flex-row rounded-lg px-3 py-3 gap-3 cursor-pointer shadow-sm dark:shadow-none transition-all duration-200 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 hover:dark:bg-gray-300 hover:bg-gray-50"
			}
		>
			<span className="w-11 h-11 rounded-lg inline-flex items-center justify-center border border-solid border-gray-200 dark:border-gray-300 dark:bg-gray-100 bg-white flex-shrink-0">
				{(!Array.isArray(props.icon) && <props.icon className="icon icon-xl" />) || <CIcon icon={props.icon} size="xl" />}
			</span>

			<div className="flex flex-col min-w-0">
				<span className="text-base font-semibold text-left text-foreground group-hover:text-primary transition-colors duration-200">{props.title}</span>
				{props.description && <p className="text-sm text-left text-foreground/60 mb-0 line-clamp-2">{props.description}</p>}
			</div>
		</div>
	</Link>
);
