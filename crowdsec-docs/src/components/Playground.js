import { useState, useEffect } from 'react';
import "@site/static/wasm/wasm_exec.js"

// Global state to manage WASM loading across all component instances
let wasmState = {
    isLoaded: false,
    isLoading: false,
    instance: null,
    error: null,
    subscribers: new Set()
};

// Custom hook to manage WASM loading
function useWasm() {
    const [isLoading, setIsLoading] = useState(!wasmState.isLoaded && !wasmState.error);
    const [error, setError] = useState(wasmState.error);

    useEffect(() => {
        // Subscribe to state changes
        const updateState = () => {
            setIsLoading(wasmState.isLoading);
            setError(wasmState.error);
        };

        wasmState.subscribers.add(updateState);

        // If WASM is already loaded, update state immediately
        if (wasmState.isLoaded) {
            setIsLoading(false);
            setError(null);
        } else if (wasmState.error) {
            setIsLoading(false);
            setError(wasmState.error);
        } else if (!wasmState.isLoading) {
            // Start loading if not already in progress
            loadWasm();
        }

        // Cleanup subscription on unmount
        return () => {
            wasmState.subscribers.delete(updateState);
        };
    }, []);

    return { isLoading, error, isLoaded: wasmState.isLoaded };
}

// Function to load WASM (called only once)
async function loadWasm() {
    if (wasmState.isLoading || wasmState.isLoaded) {
        return;
    }

    wasmState.isLoading = true;
    notifySubscribers();

    try {
        const go = new window.Go();
        const result = await WebAssembly.instantiateStreaming(
            fetch("/wasm/main.wasm"), 
            go.importObject
        );
        
        go.run(result.instance);
        window.grokInit();
        
        wasmState.isLoaded = true;
        wasmState.isLoading = false;
        wasmState.instance = result.instance;
        wasmState.error = null;
    } catch (err) {
        wasmState.isLoading = false;
        wasmState.error = err;
        console.error('Failed to load WASM:', err);
    }

    notifySubscribers();
}

// Notify all subscribers of state changes
function notifySubscribers() {
    wasmState.subscribers.forEach(callback => callback());
}

export default function Playground({ 
    children, 
    component: Component, 
    componentProps = {},
    title = "Playground",
    loadingTitle = "Loading..."
}) {
    const { isLoading, error, isLoaded } = useWasm();

    if (error) {
        return (
            <div>
                <h1>Error loading playground</h1>
                <p>Failed to load WASM: {error.message}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <h1>{loadingTitle}</h1>
            </div>
        );
    }

    return (
        <div className='tw-p-4 tw-h-full'>
            <h1 className='tw-text-2xl tw-font-bold tw-mb-4'>{title}</h1>
            {isLoaded && (
                <div>
                    {/* Render either a specific component or children */}
                    {Component ? (
                        <Component {...componentProps} />
                    ) : (
                        children || <p>WASM loaded successfully! Ready to use.</p>
                    )}
                </div>
            )}
        </div>
    );
}