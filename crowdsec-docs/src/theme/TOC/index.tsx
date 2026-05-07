import { useLocation } from '@docusaurus/router';
import PromoCard, { type PromoVariant } from '@site/src/components/docs/PromoCard';
import TOCItems from '@theme/TOCItems';
import clsx from 'clsx';
import React from 'react';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

function usePromoVariant(): PromoVariant {
  const { pathname } = useLocation();
  if (pathname.startsWith('/u/cti_api') || pathname.startsWith('/u/console/ip_reputation')) return 'cti';
  if (pathname.startsWith('/u/blocklists') || pathname.startsWith('/blocklists')) return 'engine';
  if (pathname.startsWith('/u/console')) return 'console';
  return 'console';
}

function RailPromoCard() {
  const variant = usePromoVariant();
  return <PromoCard variant={variant} />;
}

const TableOfContent = ({ className, ...props }): React.JSX.Element => (
  <div
    className={clsx('thin-scrollbar overflow-y-auto sticky hidden md:block px-1 md:px-0', className)}
    style={{
      top: 'calc(var(--ifm-navbar-height) + 1rem)',
      maxHeight: 'calc(100vh - (var(--ifm-navbar-height) + 2rem))',
    }}
  >
    <TOCItems {...props} toc={props.toc ?? []} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
    <RailPromoCard />
  </div>
);

export default TableOfContent;
