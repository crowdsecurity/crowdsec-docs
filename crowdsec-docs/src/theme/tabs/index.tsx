import CIcon from "@coreui/icons-react";
import { sanitizeTabsChildren, useScrollPositionBlocker, useTabs } from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import clsx from "clsx";
import React, { cloneElement } from "react";

const TabList = ({ className, block, selectedValue, selectValue, tabValues }): React.JSX.Element => {
	const tabRefs = [];
	const { blockElementScrollPositionUntilNextRender } = useScrollPositionBlocker();
	const handleTabChange = (event) => {
		const newTab = event.currentTarget;
		const newTabIndex = tabRefs.indexOf(newTab);
		const newTabValue = tabValues[newTabIndex].value;
		if (newTabValue !== selectedValue) {
			blockElementScrollPositionUntilNextRender(newTab);
			selectValue(newTabValue);
		}
	};
	const handleKeydown = (event) => {
		let focusElement = null;
		switch (event.key) {
			case "Enter": {
				handleTabChange(event);
				break;
			}
			case "ArrowRight": {
				const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
				focusElement = tabRefs[nextTab] ?? tabRefs[0];
				break;
			}
			case "ArrowLeft": {
				const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
				focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1];
				break;
			}
			default:
				break;
		}
		focusElement?.focus();
	};
	return (
		<div
			role="tablist"
			aria-orientation="horizontal"
			className={clsx(
				"tabs",
				{
					"tabs--block": block,
				},
				className
			)}
		>
			{tabValues.map(({ value, label, attributes, icon }) => (
				<div
					role="tab"
					tabIndex={selectedValue === value ? 0 : -1}
					aria-selected={selectedValue === value}
					key={value}
					ref={(tabControl) => tabRefs.push(tabControl)}
					onKeyDown={handleKeydown}
					onClick={handleTabChange}
					{...attributes}
					className={clsx("tabs__item !mt-0", attributes?.className, {
						"tabs__item--active": selectedValue === value,
					})}
				>
					<span className="flex gap-2 items-center">
						{!!icon && <CIcon icon={icon} size="lg" />} {label ?? value}
					</span>
				</div>
			))}
		</div>
	);
};
function TabContent({ lazy, children, selectedValue }) {
	const childTabs = (Array.isArray(children) ? children : [children]).filter(Boolean);
	if (lazy) {
		const selectedTabItem = childTabs.find((tabItem) => tabItem.props.value === selectedValue);
		if (!selectedTabItem) {
			// fail-safe or fail-fast? not sure what's best here
			return null;
		}
		return cloneElement(selectedTabItem, { className: "margin-top--md" });
	}
	return (
		<div className="margin-top--md">
			{childTabs.map((tabItem) =>
				cloneElement(tabItem, {
					key: tabItem.props.value,
					hidden: tabItem.props.value !== selectedValue,
				})
			)}
		</div>
	);
}
function TabsComponent(props) {
	const tabs = useTabs(props);
	return (
		<div
			className={clsx("tabs-container")}
			style={{
				marginBottom: "var(--ifm-leading);", // Ensure the tabs container has a bottom margin to avoid overlap with the content below
			}}
		>
			<TabList {...props} {...tabs} />
			<TabContent {...props} {...tabs} />
		</div>
	);
}
export default function Tabs(props) {
	const isBrowser = useIsBrowser();
	return (
		<TabsComponent
			// Remount tabs after hydration
			// Temporary fix for https://github.com/facebook/docusaurus/issues/5653
			key={String(isBrowser)}
			{...props}
		>
			{sanitizeTabsChildren(props.children)}
		</TabsComponent>
	);
}
