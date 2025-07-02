import Playground from "@site/src/components/Playground";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useState, useEffect, useRef } from "react";
import { json } from "@codemirror/lang-json";
import { go } from "@codemirror/lang-go";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@site/src/ui/tooltip";
import Layout from '@theme/Layout';

function Notifications() {
    // Default test alert based on CrowdSec example
    const defaultAlert = [{
        "capacity": 0,
        "decisions": [{
            "duration": "4h",
            "scope": "Ip",
            "value": "10.10.10.10",
            "type": "ban",
            "scenario": "test alert",
            "origin": "cscli"
        }],
        "events": [],
        "events_count": 1,
        "leakspeed": "0",
        "message": "test alert",
        "scenario_hash": "",
        "scenario": "test alert",
        "scenario_version": "",
        "simulated": false,
        "source": {
            "as_name": "",
            "as_number": "",
            "cn": "",
            "ip": "10.10.10.10",
            "range": "",
            "scope": "Ip",
            "value": "10.10.10.10"
        },
        "start_at": new Date().toISOString(),
        "stop_at": new Date().toISOString(),
        "created_at": new Date().toISOString()
    }];

    const [alert, setAlert] = useState(JSON.stringify(defaultAlert, null, 2));

    const defaultTemplate = `{{range . -}}
Subject: CrowdSec Alert - {{.Message}}

Alert Details:
- Scenario: {{.Scenario}}
- Source IP: {{.Source.Value}}
- Country: {{.Source.Cn}}
- Events Count: {{.EventsCount}}
- Time Range: {{.StartAt}} to {{.StopAt}}

This alert was triggered by suspicious activity from {{.Source.Value}}.
{{end -}}`;

    const [template, setTemplate] = useState(defaultTemplate);

    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    // Check for template query parameter on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const templateParam = urlParams.get('template');
        
        if (templateParam) {
            try {
                // Base64 decode the template
                const decodedTemplate = atob(templateParam);
                setTemplate(decodedTemplate);
            } catch (err) {
                console.error('Failed to decode template from query parameter:', err);
                // Keep the default template if decoding fails
            }
        }
    }, []);

    // Handle alert input changes and auto-wrap single objects in arrays
    const handleAlertChange = (value) => {
        try {
            // Try to parse the JSON
            const parsed = JSON.parse(value);

            // If it's an object (not array), wrap it in an array
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                const wrappedValue = JSON.stringify([parsed], null, 2);
                setAlert(wrappedValue);
            } else {
                // If it's already an array or other valid JSON, use as is
                setAlert(value);
            }
        } catch (err) {
            // If it's not valid JSON, just set the value as is
            // This allows users to type/edit without constant parsing errors
            setAlert(value);
        }
    };

    const formatAlert = () => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setLoading(true);
        setError("");
        setOutput("");

        // Add a delay for better UX
        timeoutRef.current = setTimeout(() => {
            try {
                // Call WASM function
                if (window.formatAlert) {
                    const result = window.formatAlert(alert, template);

                    // Handle WASM function result structure
                    if (result && result.error) {
                        setError(`WASM Error: ${result.error}`);
                        setOutput("");
                    } else if (result && result.out) {
                        setOutput(String(result.out));
                        setError("");
                    } else {
                        setError("Unexpected result format from WASM function");
                        setOutput("");
                    }
                } else {
                    setError("WASM function formatAlert not available");
                    setOutput("");
                }
            } catch (err) {
                setError(`Error: ${err.message}`);
                setOutput("");
            } finally {
                setLoading(false);
            }
        }, 800); // 800ms delay for better UX
    };

    // Auto-format when inputs change
    useEffect(() => {
        if (alert && template) {
            formatAlert();
        }

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [alert, template]);

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-space-y-3 tw-bg-gray-50 dark:tw-bg-gray-800">
            <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-2 tw-border-gray-300 dark:tw-border-gray-600 tw-border-t-blue-600 dark:tw-border-t-blue-400"></div>
            <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">Generating notification...</p>
        </div>
    );

    return (
        <div className="tw-space-y-4">
            {/* Main Layout with 3 columns */}
            <div className="tw-flex tw-gap-6 tw-h-full">
                {/* Left Column - Inputs */}
                <div className="tw-w-1/2 tw-flex-shrink-0 tw-space-y-4">
                    {/* Alert JSON Input */}
                    <div className="tw-space-y-2">
                        <div className="tw-flex tw-items-center tw-justify-between">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <label className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                                    Alert JSON
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="tw-w-4 tw-h-4 tw-rounded-full tw-bg-gray-200 dark:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-400 tw-text-xs tw-font-medium hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-transition-colors tw-flex tw-items-center tw-justify-center">
                                                ?
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="tw-max-w-xs">
                                            <div className="tw-space-y-2">
                                                <p className="tw-font-medium">How to get your own alert:</p>
                                                <div className="tw-text-xs tw-space-y-1">
                                                    <p>• Use <code className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-px-1 tw-rounded">cscli alerts list</code> to find an alert ID</p>
                                                    <p>• Use <code className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-px-1 tw-rounded">cscli alerts inspect &lt;alert_id&gt; -o json</code> to get the alert details in JSON</p>
                                                    <p>• Pipe the output to <code className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-px-1 tw-rounded">jq -c</code> to compact the output</p>
                                                    <p>• Paste the alert details - it will be auto-wrapped in an array</p>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="tw-text-xs tw-text-gray-500">
                                {alert.split('\n').length} lines
                            </span>
                        </div>
                        <div className="tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-overflow-hidden">
                            <CodeMirror
                                value={alert}
                                onChange={handleAlertChange}
                                extensions={[json()]}
                                theme="dark"
                                basicSetup={{
                                    lineNumbers: true,
                                    foldGutter: true,
                                    searchKeymap: false
                                }}
                                className="tw-text-sm"
                                height="280px"
                            />
                        </div>
                    </div>

                    {/* Template Input */}
                    <div className="tw-space-y-2">
                        <div className="tw-flex tw-items-center tw-justify-between">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <label className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                                    Go Template
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="tw-w-4 tw-h-4 tw-rounded-full tw-bg-gray-200 dark:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-400 tw-text-xs tw-font-medium hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-transition-colors tw-flex tw-items-center tw-justify-center">
                                                ?
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="tw-max-w-xs">
                                            <div className="tw-text-center">
                                                <a 
                                                    href="https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="tw-text-sm tw-font-medium tw-text-blue-600 dark:tw-text-blue-400 hover:tw-text-blue-700 dark:hover:tw-text-blue-300 hover:tw-underline tw-transition-colors"
                                                >
                                                    View Alert Model Documentation →
                                                </a>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <span className="tw-text-xs tw-text-gray-500">
                                    {template.split('\n').length} lines
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(template)}
                                    className="tw-text-xs tw-text-blue-600 hover:tw-text-blue-700 tw-font-medium tw-cursor-pointer"
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={() => {
                                        try {
                                            const encodedTemplate = btoa(template);
                                            const url = new URL(window.location);
                                            url.searchParams.set('template', encodedTemplate);
                                            navigator.clipboard.writeText(url.toString());
                                        } catch (err) {
                                            console.error('Failed to create shareable URL:', err);
                                        }
                                    }}
                                    className="tw-text-xs tw-text-green-600 hover:tw-text-green-700 tw-font-medium tw-cursor-pointer"
                                    title="Copy a shareable URL with this template encoded as a query parameter"
                                >
                                    Share
                                </button>
                            </div>
                        </div>
                        <div className="tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-overflow-hidden">
                            <CodeMirror
                                value={template}
                                onChange={setTemplate}
                                extensions={[go()]}
                                theme="dark"
                                basicSetup={{
                                    lineNumbers: true,
                                    foldGutter: true,
                                    searchKeymap: false
                                }}
                                className="tw-text-sm"
                                height="280px"
                            />
                        </div>
                    </div>
                </div>

                {/* Middle Column - Arrow */}
                <div className="tw-w-12 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                        <svg 
                            className="tw-w-6 tw-h-6 tw-text-gray-700 dark:tw-text-gray-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 7l5 5m0 0l-5 5m5-5H6" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Right Column - Output */}
                <div className="tw-flex-1 tw-flex tw-flex-col tw-space-y-2">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <label className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                            Output
                        </label>
                    </div>

                    {loading ? (
                        <div className="tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-flex-1 tw-overflow-hidden">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="tw-p-3 tw-bg-red-50 dark:tw-bg-red-900/20 tw-border tw-border-red-200 dark:tw-border-red-800 tw-rounded-md tw-flex-1 tw-flex tw-items-center tw-justify-center">
                            <p className="tw-text-sm tw-text-red-700 dark:tw-text-red-400 tw-text-center">{error}</p>
                        </div>
                    ) : (
                        <div className="tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-flex-1">
                            <CodeMirror
                                value={output || ""}
                                editable={false}
                                theme="dark"
                                basicSetup={{
                                    lineNumbers: false,
                                    foldGutter: false,
                                    searchKeymap: false,
                                }}
                                extensions={ EditorView.lineWrapping }
                                className="tw-text-sm tw-bg-gray-50 dark:tw-bg-gray-800"
                                height="610px"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PlaygroundNotifications() {
    return (
        <Layout>
            <Playground
                component={Notifications}
                componentProps={{}}
                title="Notifications"
                loadingTitle="Loading Notifications..."
            />
        </Layout>
    );
}