import React from "react";

const AcademyPromo = ({ ...props }): React.JSX.Element => {
	const LINK = `https://academy.crowdsec.net/course/${props.course}${process.env.NODE_ENV === "production" ? props.utm : " "}`;
	return (
		<div>
			<hr />
			<section className="w-4/5 m-auto">
				{!!props.title && <h2>{props.title}</h2>}
				<div className="row">
					<div className="col">
						{!!props.image && (
							<a href={LINK} target="_blank">
								<img src={`/img/academy/${props.image}`} alt={props.title} />
							</a>
						)}
					</div>
					<div className="col">
						{!!props.description && <p>{props.description}</p>}
						{!!props.course && (
							<a href={LINK} target="_blank">
								<strong>Learn with CrowdSec Academy</strong>
							</a>
						)}
					</div>
				</div>
			</section>
			<hr />
		</div>
	);
};

export default AcademyPromo;
