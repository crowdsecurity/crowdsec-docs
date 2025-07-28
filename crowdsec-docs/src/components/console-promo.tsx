import useBaseUrl from "@docusaurus/useBaseUrl";
import { Button } from "@site/src/ui/button";
import { Card, CardContent, CardHeader } from "@site/src/ui/card";
import React from "react";

const ConsolePromo = ({ ...props }): React.JSX.Element => {
	const url = useBaseUrl(`/img/${props.image}`);
	return (
		<Card className="min-h-[200px] flex flex-col">
			<CardHeader className="flex-shrink-0">{props.title ? <h3 className="text-left">{props.title}</h3> : null}</CardHeader>
			<CardContent className="flex-row flex space-x-4 flex-1">
				<div className="flex-col flex justify-between flex-1">
					{props.description ? <p className="text-left text-base text-card-foreground">{props.description}</p> : null}
					<div className="text-left">
						<a href={props.link} target="_blank">
							<Button color="primary" className="w-full md:w-1/2">
								{props.text ?? "Get Started"}
							</Button>
						</a>
					</div>
				</div>

				{props.image ? <img src={url} alt={props.title} className="h-1/2 w-1/2 object-contain rounded hidden md:flex" /> : null}
			</CardContent>
		</Card>
	);
};

export default ConsolePromo;
