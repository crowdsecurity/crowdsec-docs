import Layout from '@theme/Layout';
import SearchBar from '@theme/SearchBar';
import React, { useEffect } from 'react';

import PathCard from '../components/docs/PathCard';
import PathCards from '../components/docs/PathCards';
import PopularChips from '../components/docs/PopularChips';
import RunningStrip from '../components/docs/RunningStrip';
import GuidedSetupCard from '../components/docs/GuidedSetupCard';
import PathwayRow from '../components/docs/PathwayRow';
import ShieldIcon from '../components/docs/icons/ShieldIcon';
import BlocklistIcon from '../components/docs/icons/BlocklistIcon';
import CtiIcon from '../components/docs/icons/CtiIcon';

/* ── Colour tokens — must match crowdsec-tokens.css dark values so the
   home page (which sits outside doc pages) also looks correct.        */
const CS_ORANGE = 'var(--cs-orange)';
const CS_TEAL   = 'var(--cs-teal)';
const CS_VIOLET = 'var(--cs-violet)';

const securityEngineSteps = [
  {
    title: 'Install the Security Engine',
    desc: 'Runs on your server, detects attack patterns in real time. Immediately protected with the CrowdSec Community Blocklist.',
  },
  {
    title: 'Activate the WAF module',
    desc: 'Layer in the AppSec component to inspect HTTP traffic and block web exploits before they reach your app.',
  },
  {
    title: 'Subscribe to blocklists',
    desc: 'Add a selection of extra blocklists on top of the built-in detection & community blocklist.',
  },
  {
    title: 'Craft your own rules',
    desc: 'Write custom scenarios for your stack, then share them back with the community on the Hub.',
  },
];

const blocklistSteps = [
  {
    title: 'Create a blocklist integration endpoint',
    desc: 'Generates a dedicated URL and credentials to serve blocklists to your perimeter devices.',
  },
  {
    title: 'Choose which blocklists to serve',
    desc: 'Select from curated feeds by threat category: scanners, bots, TOR exits, exploits, and more.',
  },
  {
    title: 'Plug it in as an external threat feed',
    desc: 'Point your firewall, CDN, or WAF at the endpoint. Use the feed to protect your infrastructure.',
  },
];

const ctiSteps = [
  {
    title: 'Look up any IP in the Console',
    desc: 'Search instantly from our Web UI. Get reputation score, behaviors, attack history, and CVE links.',
  },
  {
    title: 'Generate a CTI API key',
    desc: 'Unlock programmatic access to 30+ data points on IPs detected by CrowdSec Network.',
  },
  {
    title: 'Connect to your SIEM/SOAR/TIP',
    desc: 'Native integrations for Splunk, Sentinel, QRadar, TheHive, OpenCTI, MISP, and more.',
  },
];

const alreadyRunningPills = [
  { label: '🖥️ Open the Console', href: 'https://app.crowdsec.net' },
  { label: '🛡️ Activate the WAF', href: '/docs/next/appsec/intro' },
  { label: '📊 Measure what is being Blocked', href: '/u/console/remediation_metrics' },
  { label: '🩺 Check my Stack Health', href: '/u/console/stackhealth' },
];

const popularChips = [
  { label: '🖥️ Console', href: '/u/console/intro' },
  { label: '🛡️ AppSec / WAF', href: '/docs/next/appsec/intro' },
  { label: '💻 CLI Reference', href: '/docs/next/cscli/' },
  { label: '🔑 CTI API Keys', href: '/u/console/ip_reputation/api_keys' },
  { label: '❓ Troubleshooting', href: '/u/troubleshooting/intro' },
  { label: '🌐 CrowdSec.net', href: 'https://www.crowdsec.net' },
];

export default function HomePage() {
  useEffect(() => {
    document.body.classList.add('homepage');
    document.documentElement.classList.add('homepage');
    return () => {
      document.body.classList.remove('homepage');
      document.documentElement.classList.remove('homepage');
    };
  }, []);

  return (
    <Layout title="Documentation" description="CrowdSec — the open-source & participative IPS">
      <main>
        <div className="container" style={{ maxWidth: '940px', margin: '0 auto', padding: '0 16px' }}>
          {/* ── Hero ──────────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 14,
              padding: '48px 0 32px',
              maxWidth: 680,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-160px',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(ellipse 50% 60% at 40% 0%, color-mix(in srgb, var(--cs-orange) 8%, transparent) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                background: 'var(--cs-orange-soft)',
                border: '1px solid color-mix(in srgb, var(--cs-orange) 30%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cs-orange)',
                fontSize: 22,
                fontWeight: 800,
                fontFamily: 'var(--cs-font-sans)',
              }}
              aria-hidden="true"
            >
              C
            </div>
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: 'var(--cs-ink)',
                margin: 0,
              }}
            >
              Find the right<br />CrowdSec tool for you
            </h1>
            <p style={{ fontSize: 17, color: 'var(--cs-ink-dim)', lineHeight: 1.6, margin: 0 }}>
              IDPS/WAF · Blocklist feeds · IP Reputation
            </p>
          </div>

          {/* ── Search ────────────────────────────────────────────────── */}
          <div className="homepage-search" style={{ marginBottom: 32, maxWidth: 680 }}>
            <SearchBar />
          </div>

          {/* ── Path cards ────────────────────────────────────────────── */}
          <PathCards>
            <PathCard
              color={CS_ORANGE}
              icon={<ShieldIcon />}
              title="Detect & Block attacks on my servers"
              desc="Locally identify and ban bad behaving IPs observed in your logs and requests with CrowdSec Detection Scenarios, and Virtual-Patching Collections."
              tag="Security Engine"
              href="/security-engine"
            />
            <PathCard
              color={CS_TEAL}
              icon={<BlocklistIcon />}
              title="Push a Blocklist into my firewall, CDN or WAF"
              desc="You manage network perimeter devices and want a URL to subscribe to. No agent to install."
              tag="Blocklist Integration"
              href="/blocklists"
            />
            <PathCard
              color={CS_VIOLET}
              icon={<CtiIcon />}
              title="Investigate IPs Behaviors and Enrich Alerts"
              desc="You're a security analyst or developer who wants IP context, behaviors, CVEs, Aggressivity... In a browser or via REST API."
              tag="IP Reputation & CTI"
              href="/u/cti_api/intro"
            />
          </PathCards>

          {/* ── Already running strip ─────────────────────────────────── */}
          <RunningStrip label="Already running CrowdSec?" pills={alreadyRunningPills} />

          {/* ── How each path works ───────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: 'var(--cs-ink-mute)',
              fontSize: 10,
              fontFamily: 'var(--cs-font-mono)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '8px 0 16px',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--cs-border-hi)' }} />
            💡 how each path works
            <div style={{ flex: 1, height: 1, background: 'var(--cs-border-hi)' }} />
          </div>

          <PathwayRow
            color={CS_ORANGE}
            eyebrow="Security Engine"
            title="Detect and block malicious behaviors on your infrastructure"
            steps={securityEngineSteps}
            ctaLabel="Install CrowdSec"
            ctaHref="/security-engine"
          />
          <PathwayRow
            color={CS_TEAL}
            eyebrow="Blocklists"
            title="Push curated threat feeds directly into your firewall, CDN, or WAF"
            steps={blocklistSteps}
            ctaLabel="Discover Blocklists"
            ctaHref="/blocklists"
          />
          <PathwayRow
            color={CS_VIOLET}
            eyebrow="IP Reputation & CTI"
            title="Query threat intel in the browser or via API in your tools"
            steps={ctiSteps}
            ctaLabel="Explore CTI"
            ctaHref="/u/cti_api/intro"
          />

          {/* ── Guided setup card ─────────────────────────────────────── */}
          <GuidedSetupCard
            title="Not sure where to start?"
            desc="Answer a few questions and get a recommended path with install steps for your stack."
            primaryCta={{ label: '🧭 Use Case Questionnaire', href: 'https://start.crowdsec.net/' }}
            secondaryCta={{ label: '⚡ Try in Sandbox', href: 'https://killercoda.com/iiamloz/scenario/crowdsec-setup' }}
          />

          {/* ── Popular docs ──────────────────────────────────────────── */}
          <PopularChips chips={popularChips} />
        </div>
      </main>
    </Layout>
  );
}
