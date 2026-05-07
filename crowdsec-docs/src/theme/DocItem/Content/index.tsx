import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemContent from '@theme-original/DocItem/Content';
import type { Props } from '@theme/DocItem/Content';
import React from 'react';

export default function DocItemContentWrapper(props: Props): React.JSX.Element {
  const { frontMatter } = useDoc();
  const eyebrow = (frontMatter as Record<string, unknown>).eyebrow as string | undefined;

  return (
    <>
      {eyebrow && <span className="cs-eyebrow">{eyebrow}</span>}
      <DocItemContent {...props} />
    </>
  );
}
