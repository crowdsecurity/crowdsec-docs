import React from "react"
import clsx from "clsx"
import Layout from "@theme/Layout"
import Link from "@docusaurus/Link"
import styles from "./index.module.css"
import QuickStart from "../components/QuickStart"
import GetToKnowUs from "../components/GetToKnowUs"

function HomepageHeader() {
    return (
        <section
            className={clsx(
                "hero tw-bg-gray-900 tw-flex-1 relative",
                styles.heroBanner
            )}
        >
            <div className="tw-block tw-absolute tw-top-0 tw-left-1/2 -tw-translate-x-1/2 tw-h-80 tw-w-full tw-bg-landing tw-bg-cover tw-bg-center tw-z-10 tw-opacity-50" />
            <div className="container tw-space-y-4 md:tw-space-y-12 tw-z-20">
                <div>
                    <div className="tw-flex tw-gap-4 tw-justify-between tw-flex-col-reverse md:tw-flex-row tw-items-center md:tw-items-start">
                        <div className="tw-text-left tw-w-full">
                            <h1 className="tw-mb-1 tw-text-white">
                                Welcome to the CrowdSec Documentation
                            </h1>
                            <p className="tw-max-w-xl tw-text-gray-300 tw-text-sm">
                                CrowdSec provides open source solution for
                                detecting and blocking malicious IPs,
                                safeguarding both infrastructure and application
                                security.
                            </p>
                        </div>
                        <img
                            src="/img/crowdsec_logo.png"
                            className="tw-h-20 tw-w-28 md:tw-h-24 md:tw-w-auto"
                        />
                    </div>
                    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-justify-start tw-gap-2">
                        <Link
                            className="button tw-bg-primary tw-text-white hover:tw-text-white/80 hover:tw-bg-primary/80 active:tw-bg-primary/90"
                            to="/u/getting_started/intro"
                        >
                            Get started
                        </Link>
                        <Link
                            className="button tw-text-white hover:tw-text-white hover:tw-bg-white/10 active:tw-bg-white/20"
                            to="https://app.crowdsec.net/"
                        >
                            Explore the Console
                        </Link>
			<Link
                            className="button tw-text-white hover:tw-text-white hover:tw-bg-white/10 active:tw-bg-white/20"
                            to="https://killercoda.com/iiamloz/scenario/crowdsec-setup"
                        >
                            Online Sandbox
                        </Link>

                    </div>
                </div>

                <QuickStart />

                <GetToKnowUs />
            </div>
        </section>
    )
}

export default function Home() {
    return (
        <Layout
            title={`Documentation`}
            description="CrowdSec, the open-source & participative IPS"
        >
            <HomepageHeader />
        </Layout>
    )
}
