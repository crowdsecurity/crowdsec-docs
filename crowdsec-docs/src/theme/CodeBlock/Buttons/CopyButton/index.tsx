import { useCodeBlockContext } from "@docusaurus/theme-common/internal";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function CopyButton({ className }: Readonly<{ className?: string }>) {
  const { metadata: { code } } = useCodeBlockContext();
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copyCode = useCallback(() => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      timeout.current = setTimeout(() => setIsCopied(false), 1500);
    });
  }, [code]);

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <button
      type="button"
      aria-label={isCopied ? "Copied to clipboard" : "Copy code to clipboard"}
      title={isCopied ? "Copied!" : "Copy"}
      onClick={copyCode}
      className={`cs-codeblock__copy ${className ?? ''}`}
      style={{ opacity: isCopied ? 0.75 : 1 }}
    >
      {isCopied ? 'COPIED ✓' : 'COPY'}
    </button>
  );
}
