import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

const RemediationFeatures = (): React.JSX.Element => {
	return (
		<section className="flex items-center py-8 w-full bg-primary text-center justify-center">
			<div className="container">
				<h1 className="remediationTitle"> Examples of detected behaviors </h1>
				<div style={{ justifyContent: "center", paddingTop: "10px" }} className="justify-center">
					<img alt="Remediation Features" src={useBaseUrl("/img/remediations.png")} width="75%" height="75%" />
				</div>
			</div>
		</section>
	);
};

export default RemediationFeatures;
