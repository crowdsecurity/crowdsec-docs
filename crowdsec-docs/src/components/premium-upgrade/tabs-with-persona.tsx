import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import type { ReactElement } from "react";
import React, { useState } from "react";

export interface PersonaOption {
	value: string;
	icon: string;
	label: string;
	description: string;
	tag: string;
}

export interface TabsWithPersonaProps {
	options: PersonaOption[];
	defaultValue?: string;
	groupId?: string;
	headerLabel?: string;
	children: ReactElement<typeof TabItem> | ReactElement<typeof TabItem>[];
}

/**
 * Tabs component with custom persona selector header
 * Combines Docusaurus Tabs functionality with styled persona cards
 *
 * @example
 * <TabsWithPersona
 *   options={[
 *     { value: "devops", icon: "⚙️", label: "DevOps", description: "...", tag: "Solo" }
 *   ]}
 *   defaultValue="devops"
 *   groupId="user-persona"
 * >
 *   <TabItem value="devops">Content</TabItem>
 * </TabsWithPersona>
 */
export const TabsWithPersona = ({
	options,
	defaultValue,
	groupId,
	headerLabel = "Your Profile",
	children,
}: TabsWithPersonaProps): React.JSX.Element => {
	const [selectedValue, setSelectedValue] = useState<string>(defaultValue || options[0]?.value || "");

	const handleSelect = (value: string) => {
		setSelectedValue(value);
		// Trigger tab change by programmatically clicking the hidden tab button
		const tabButton = document.querySelector(`[role="tab"][data-value="${value}"]`) as HTMLElement;
		if (tabButton) {
			tabButton.click();
		}
	};

	return (
		<div className="tabs-with-persona">
			{/* Custom Persona Header */}
			<div className="persona-tabs-header mb-8">
				<p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{headerLabel}</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{options.map((option) => {
						const isSelected = selectedValue === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => handleSelect(option.value)}
								className={`
									persona-card text-left p-5 rounded-xl border-2 transition-all duration-200
									${
										isSelected
											? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
											: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-400 hover:shadow-md"
									}
								`}
							>
								<div
									className={`
										text-3xl mb-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all
										${isSelected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"}
									`}
								>
									{option.icon}
								</div>
								<h3
									className={`
										font-semibold text-base mb-2 transition-colors
										${isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"}
									`}
								>
									{option.label}
								</h3>
								<p
									className={`
										text-sm mb-3 leading-relaxed transition-colors
										${isSelected ? "text-white/80" : "text-gray-600 dark:text-gray-300"}
									`}
								>
									{option.description}
								</p>
								<span
									className={`
										inline-block text-xs font-medium px-3 py-1 rounded-full transition-all
										${isSelected ? "bg-white/20 text-white/90" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}
									`}
								>
									{option.tag}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Hidden Docusaurus Tabs - just for content switching */}
			<div className="hidden-tabs" style={{ display: "none" }}>
				<Tabs defaultValue={defaultValue} groupId={groupId}>
					{children}
				</Tabs>
			</div>

			{/* Tab Content - controlled by selected value */}
			<div className="tab-content">
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child) && child.props.value === selectedValue) {
						return <div key={child.props.value}>{child.props.children}</div>;
					}
					return null;
				})}
			</div>
		</div>
	);
};
