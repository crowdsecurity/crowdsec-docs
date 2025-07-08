import useBaseUrl from "@docusaurus/useBaseUrl";
import { Button } from "@site/src/ui/button";
import { Card, CardContent, CardHeader } from "@site/src/ui/card";
import React from "react";

const ConsolePromo = ({ ...props }): React.JSX.Element => {
	const url = useBaseUrl(`/img/${props.image}`);
	return (
		<Card>
			<CardHeader>{props.title ? <h3 className="text-left">{props.title}</h3> : null}</CardHeader>
			<CardContent className="flex-row flex space-x-4">
				<div className="flex-col flex text-card-foreground flex-1 h-full text-base">
					{props.description ? <p className="md:px-4">{props.description}</p> : null}
					<div className="text-center">
						<a href={props.link} target="_blank">
							<Button color="primary" className=" w-full md:w-auto">
								{props.text ?? "Get Started"}
							</Button>
						</a>
					</div>
				</div>

				{props.image ? <img src={url} alt={props.title} className="h-1/2 w-1/2 hidden md:flex" /> : null}
			</CardContent>
		</Card>
	);
};

export default ConsolePromo;
