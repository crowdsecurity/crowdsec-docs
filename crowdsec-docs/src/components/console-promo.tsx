import React from "react"
import useBaseUrl from "@docusaurus/useBaseUrl"
import Link from "@docusaurus/Link"

const ConsolePromo = ({ ...props }): React.JSX.Element => {
    const url = useBaseUrl("/img/" + props.image)
    return (
        <div className="tw-flex-row tw-flex tw-bg-alpa-primary tw-p-4 tw-rounded-xl tw-items-center">
            <div className="tw-flex-col tw-flex tw-py-1 tw-pr-4 tw-text-white tw-flex-1 tw-h-full">
                {Boolean(props.title) ? (
                    <h3 className="tw-text-center tw-text-xl sm:tw-text-2xl lg:tw-text-left lg:tw-text-3xl">
                        {props.title}
                    </h3>
                ) : null}
                {Boolean(props.description) ? (
                    <p className="md:tw-px-4">{props.description}</p>
                ) : null}
                <Link
                    to={props.link}
                    className="tw-px-4 tw-w-full lg:tw-w-1/2 tw-py-2 tw-rounded-lg hover:tw-cursor-pointer tw-bg-primary tw-text-white tw-text-center hover:tw-text-white/80 hover:tw-bg-primary/80 active:tw-bg-primary/90 hover:tw-no-underline"
                >
                    {props.text ?? "Get Started"}
                </Link>
            </div>
            {Boolean(props.image) ? (
                <img
                    src={url}
                    alt={props.title}
                    className="tw-h-1/2 tw-w-1/2 tw-hidden md:tw-flex"
                />
            ) : null}
        </div>
    )
}

export default ConsolePromo
