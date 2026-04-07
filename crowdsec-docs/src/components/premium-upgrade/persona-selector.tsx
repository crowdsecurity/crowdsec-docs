import React, { useState } from "react";

export interface PersonaOption {
	id: string;
	icon: string;
	title: string;
	description: string;
	tag: string;
}

export interface PersonaSelectorProps {
	options: PersonaOption[];
	defaultSelected?: string;
	onChange?: (selectedId: string) => void;
	label?: string;
}

export const PersonaSelector = ({
	options,
	defaultSelected,
	onChange,
	label = "Your Profile",
}: PersonaSelectorProps): React.JSX.Element => {
	const [selected, setSelected] = useState<string>(defaultSelected || options[0]?.id || "");

	const handleSelect = (id: string) => {
		setSelected(id);
		onChange?.(id);
	};

	return (
		<div className="persona-selector mb-8">
			<p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-600 mb-4">{label}</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{options.map((option) => (
					<button
						key={option.id}
						type="button"
						onClick={() => handleSelect(option.id)}
						className={`
							persona-card text-left p-5 rounded-xl border-2 transition-all duration-200
							${
								selected === option.id
									? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
									: "border-border bg-card hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md"
							}
						`}
					>
						<div
							className={`
								text-3xl mb-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all
								${selected === option.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}
							`}
						>
							{option.icon}
						</div>
						<h3
							className={`
								font-semibold text-base mb-2 transition-colors
								${selected === option.id ? "text-white" : "text-gray-900 dark:text-gray-100"}
							`}
						>
							{option.title}
						</h3>
						<p
							className={`
								text-sm mb-3 leading-relaxed transition-colors
								${selected === option.id ? "text-white/80" : "text-gray-600 dark:text-gray-400"}
							`}
						>
							{option.description}
						</p>
						<span
							className={`
								inline-block text-xs font-medium px-3 py-1 rounded-full transition-all
								${
									selected === option.id
										? "bg-white/20 text-white/90"
										: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
								}
							`}
						>
							{option.tag}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};
