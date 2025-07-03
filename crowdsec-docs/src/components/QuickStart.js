import CIcon from "@coreui/icons-react"
import cibLinux from "@site/static/img/logo/linux-colored.svg"
import cibDocker from "@site/static/img/logo/docker-colored.svg"
import cibWindows from "@site/static/img/logo/windows-colored.svg"
import cibFreebsd from "@site/static/img/logo/freebsd-colored.svg"
import cibApple from "@site/static/img/logo/apple-colored.svg"
import opnsenseLogo from "@site/static/img/logo-opnsense.svg"
import pfSenseLogo from "@site/static/img/logo-pfsense.svg"
import cibKubernetes from "@site/static/img/logo/kubernetes-colored.svg"
import whmLogo from "@site/static/img/logo-whm.svg"
import cloudwaysLogo from "@site/static/img/logo-cloudways.svg"
import Link from "@docusaurus/Link"

const staticData = [
    {
        icon: cibLinux,
        text: "Linux",
        link: "/u/getting_started/installation/linux",
    },
    {
        icon: cibWindows,
        text: "Windows",
        link: "/u/getting_started/installation/windows",
    },
    {
        icon: cibFreebsd,
        text: "FreeBSD",
        link: "/u/getting_started/installation/freebsd",
    },
    {
        icon: cibApple,
        text: "macOS",
        link: "/u/getting_started/installation/macos",
    },
    {
        icon: cibDocker,
        text: "Docker",
        link: "/u/getting_started/installation/docker",
    },
    {
        icon: cibKubernetes,
        text: "Kubernetes",
        link: "/u/getting_started/installation/kubernetes",
    },
    {
        icon: opnsenseLogo,
        text: "OPNsense",
        link: "/u/getting_started/installation/opnsense",
    },
    {
        icon: pfSenseLogo,
        text: "pfSense",
        link: "/u/getting_started/installation/pfsense",
    },
    {
        icon: whmLogo,
        text: "WHM",
        link: "/u/getting_started/installation/whm",
    },
    // Experimental, not linking to it
    // {
    //     icon: cloudwaysLogo,
    //     text: "Cloudways",
    //     link: "/u/getting_started/installation/cloudways",
    // },
]

export default function QuickStart() {
    return (
        <section>
            <div className="tw-text-left">
                <h2 className="tw-mb-1 tw-text-white">
                    Select your environment
                </h2>
                <p className="tw-max-w-xl tw-text-sm tw-text-gray-300">
                    We can secure your stack. Just select your platform and get
                    started.
                </p>
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mt-4">
                {staticData.map((props) => (
                    <Link
                        key={props.text}
                        href={props.link}
                        className="tw-border-0 hover:tw-no-underline"
                    >
                        <div
                            className={
                                "tw-w-full tw-flex tw-justify-start tw-items-center tw-border tw-border-transparent tw-flex-row tw-rounded-lg tw-px-2 tw-py-2 tw-gap-2 tw-flex-1 tw-cursor-pointer tw-bg-gray-800 tw-ease-in-out tw-text-white tw-duration-300 hover:tw-border-white hover:tw-bg-gray-700"
                            }
                        >
                            <span className="tw-border-2 tw-border-gray-700 tw-bg-alpa-primary tw-w-12 tw-h-12 tw-rounded-lg tw-inline-flex tw-items-center tw-justify-center">
                                {(!Array.isArray(props.icon) && (
                                    <props.icon className="icon icon-xl" />
                                )) || <CIcon icon={props.icon} size="xl" />}
                            </span>

                            <span
                                className={
                                    "tw-text-md tw-font-semibold tw-flex-1 tw-text-left"
                                }
                            >
                                {props.text}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            <p className="tw-text-xs tw-my-1 tw-text-gray-300 tw-text-right">
                *Logos and trademarks, such as the logos above, are the property
                of their respective owners and are used here for identification
                purposes only.
            </p>
        </section>
    )
}
