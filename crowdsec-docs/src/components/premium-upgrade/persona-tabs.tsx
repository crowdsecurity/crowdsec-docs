import React from "react";

export interface PersonaOption {
	value: string;
	icon: string;
	label: string;
	description: string;
	tag: string;
}

export interface PersonaTabsHeaderProps {
	options: PersonaOption[];
	selectedValue: string;
	onSelect: (value: string) => void;
	headerLabel?: string;
}

/**
 * Custom header for Docusaurus Tabs that looks like persona selector cards
 * Use this with Docusaurus <Tabs> component by passing a custom tabsHeader
 */
export const PersonaTabsHeader = ({
	options,
	selectedValue,
	onSelect,
	headerLabel = "Your Profile",
}: PersonaTabsHeaderProps): React.JSX.Element => {
	return (
		<div className="persona-tabs-header mb-8">
			<p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-600 mb-4">{headerLabel}</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{options.map((option) => {
					const isSelected = selectedValue === option.value;
					return (
						<button
							key={option.value}
							type="button"
							role="tab"
							aria-selected={isSelected}
							onClick={() => onSelect(option.value)}
							className={`
								persona-card text-left p-5 rounded-xl border-2 transition-all duration-200
								${
									isSelected
										? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
										: "border-border bg-card hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md"
								}
							`}
						>
							<div
								className={`
									text-3xl mb-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all
									${isSelected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}
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
									${isSelected ? "text-white/80" : "text-gray-600 dark:text-gray-400"}
								`}
							>
								{option.description}
							</p>
							<span
								className={`
									inline-block text-xs font-medium px-3 py-1 rounded-full transition-all
									${isSelected ? "bg-white/20 text-white/90" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}
								`}
							>
								{option.tag}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};
