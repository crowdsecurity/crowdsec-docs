import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWindows,
    faLinux,
    faFreebsd,
    faApple,
    faDocker,
} from "@fortawesome/free-brands-svg-icons";
import Link from "@docusaurus/Link";

const staticData = [
    {
        icon: faLinux,
        text: "Linux",
        link: "/u/getting_started/installation/linux",
    },
    {
        icon: faWindows,
        text: "Windows",
        link: "/u/getting_started/installation/windows",
    },
    {
        icon: faFreebsd,
        text: "FreeBSD",
        link: "/u/getting_started/installation/freebsd",
    },
    {
        icon: faApple,
        text: "macOS",
        link: "/u/getting_started/installation/macos",
    },
    {
	icon: faDocker,
	text: "Docker",
	link: "/u/getting_started/installation/docker",
    
    },
];

export default function QuickStart() {
    return (
        <>
        <div className="tw-flex tw-flex-col tw-items-center tw-border-2 tw-border-white tw-border-solid tw-rounded-xl tw-2-4/5 sm:tw-w-2/3 tw-m-auto tw-transition tw-duration-500 tw-ease-in-out tw-transform hover:tw-border-secondary">
            <h1 className="tw-text-2xl tw-border-white tw-border-solid tw-rounded-xl tw-px-8 tw-bg-black tw--translate-y-4">Quick Start</h1>
            <div className="tw-flex tw-flex-row tw-justify-between tw-gap-2 tw-w-1/2 sm:tw-w-4/5 tw-flex-wrap tw-pb-2">
                {staticData.map((item, index) => (
                    <div className="tw-w-full sm:tw-w-fit tw-p-4 tw-transition tw-duration-500 tw-ease-in-out tw-transform hover:tw-border-secondary">
                        <Link key={index} to={item.link}>
                            <FontAwesomeIcon
				alt={item.text}
                                icon={item.icon}
                                size="4x"
				className="tw-text-white tw-transition tw-duration-500 tw-ease-in-out tw-transform hover:tw-text-secondary"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        <p className="tw-text-xs tw-my-1">**Logos and trademarks, such as the logos above, are the property of their respective owners and are used here for identification purposes only.</p>
        </>
    );
}
