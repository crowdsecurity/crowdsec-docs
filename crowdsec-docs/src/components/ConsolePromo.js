import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

export default function ConsolePromo({ ...props }) {
    return (
        <div className="tw-flex-row tw-flex tw-bg-primary-dark tw-p-4 tw-rounded-xl tw-items-center">
            <div className="tw-flex-col tw-flex tw-py-1 tw-pr-4 tw-text-white tw-flex-1 tw-h-full">
                {!!props.title ? (
                    <h3 className="tw-text-center tw-text-xl sm:tw-text-2xl lg:tw-text-left lg:tw-text-3xl">{props.title}</h3>
                ) : null}
                {!!props.description ? <p className="md:tw-px-4">{props.description}</p> : null}
                <Link
                    to={props.link}
                    className="tw-px-4 tw-w-full lg:tw-w-1/2 tw-py-2 tw-rounded-lg hover:tw-cursor-pointer tw-bg-secondary tw-text-black hover:tw-text-black tw-text-center"
                >
                    Get Started
                </Link>
            </div>
            {!!props.image ? (
                <img
                    src={useBaseUrl("/img/" + props.image)}
                    alt={props.title}
                    className="tw-h-1/2 tw-w-1/2 tw-hidden md:tw-flex"
                />
            ) : null}
        </div>
    );
}
