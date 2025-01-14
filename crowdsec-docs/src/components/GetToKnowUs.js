import Link from "@docusaurus/Link"

const staticData = [
    {
        icon: () => (
            <img
                src="/img/crowdsec_logo.png"
                className="tw-h-6 tw-w-9"
                alt="CrowdSec logo"
            />
        ),
        title: "What is CrowdSec?",
        description:
            "Data curated solution with a bunch of millions IPs detected by our large community.",
        link: "https://www.crowdsec.net",
    },
    {
        icon: () => (
            <img
                src="/img/icons/radar-target.webp"
                className="tw-h-6 tw-w-6"
                alt="security engines"
            />
        ),
        title: "Security Engines",
        description: "Secure yourself.",
        link: "/docs/intro",
    },
    {
        icon: () => <span className="tw-text-2xl">🖥️</span>,
        title: "CrowdSec Console",
        description: "Manage and monitor your security.",
        link: "/u/console/intro",
    },
    {
        icon: () => <span className="tw-text-2xl">🧑🏻‍💻</span>,
        title: "CrowdSec CLI",
        description: "Use our command line interface.",
        link: "/docs/cscli/",
    },
    {
        icon: () => (
            <img
                src="/img/icons/waf.webp"
                className="tw-h-6 tw-w-6"
                alt="Web application firewall"
            />
        ),
        title: "CrowdSec WAF",
        description: "Protect your web applications.",
        link: "/docs/appsec/intro",
    },
    {
        icon: () => (
            <img
                src="/img/icons/shield.webp"
                className="tw-h-6 tw-w-6"
                alt="blocklists"
            />
        ),
        title: "Blocklists",
        description: "Block thousands of IPs.",
        link: "/u/blocklists/intro",
    },
    {
        icon: () => (
            <img
                src="/img/icons/world.webp"
                className="tw-h-6 tw-w-6"
                alt="world API"
            />
        ),
        title: "APIs",
        description: "Integrate with your tools.",
        link: "/u/cti_api/intro",
    },
]

export default function GetToKnowUs() {
    return (
        <section>
            <h2 className="tw-text-left tw-text-white">Get to know us!</h2>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                {staticData.map((props, index) => (
                    <Link
                        key={props.text}
                        href={props.link}
                        className={
                            "tw-border-0 hover:tw-no-underline " +
                            (index === 0 ? "md:tw-col-span-2" : "")
                        }
                    >
                        <div
                            className={
                                "tw-w-full tw-flex tw-justify-start tw-items-start tw-border tw-border-transparent tw-flex-row tw-rounded-lg tw-px-2 tw-py-2 tw-gap-2 tw-flex-1 tw-cursor-pointer tw-bg-gray-800 tw-ease-in-out tw-text-white tw-duration-300 hover:tw-border-white hover:tw-bg-gray-700"
                            }
                        >
                            <span className="tw-border-2 tw-border-gray-700 tw-bg-alpa-primary tw-w-12 tw-h-12 tw-rounded-lg tw-inline-flex tw-items-center tw-justify-center">
                                <props.icon className="icon icon-xl" />
                            </span>

                            <div className="tw-flex tw-flex-col tw-items-start tw-flex-1">
                                <span
                                    className={
                                        "tw-text-md tw-font-bold tw-flex-1"
                                    }
                                >
                                    {props.title}
                                </span>
                                <p className="tw-text-sm tw-text-left tw-text-gray-300 tw-mb-0">
                                    {props.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
