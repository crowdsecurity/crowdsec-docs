import React from 'react';
import { useHistory } from '@docusaurus/router';

export default function TryTemplateButton({ 
    template, 
    children = "Try in Playground",
    className = "",
    variant = "primary"
}) {
    const history = useHistory();

    const handleClick = () => {
        try {
            // Base64 encode the template
            const encodedTemplate = btoa(template);
            
            // Navigate to the playground page with the template query parameter
            const playgroundUrl = `/playground/notification?template=${encodeURIComponent(encodedTemplate)}`;
            history.push(playgroundUrl);
        } catch (err) {
            console.error('Failed to encode template or navigate:', err);
            // Fallback: navigate without template
            history.push('/playground/notification');
        }
    };

    // Define button styles based on variant
    const getButtonClasses = () => {
        const baseClasses = "tw-cursor-pointer tw-my-2 tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-md tw-transition-colors tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2";
        
        const variantClasses = {
            primary: "tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white focus:tw-ring-blue-500",
            secondary: "tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-900 focus:tw-ring-gray-500 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 dark:tw-text-white",
            outline: "tw-border tw-border-blue-600 tw-text-blue-600 hover:tw-bg-blue-50 focus:tw-ring-blue-500 dark:tw-border-blue-400 dark:tw-text-blue-400 dark:hover:tw-bg-blue-900/20"
        };

        return `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;
    };

    return (
        <button
            onClick={handleClick}
            className={getButtonClasses()}
            title="Open this template in the notification playground"
        >
            <svg 
                className="tw-w-4 tw-h-4 tw-mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
            </svg>
            {children}
        </button>
    );
} 