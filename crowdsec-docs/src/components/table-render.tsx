import BrowserOnly from "@docusaurus/BrowserOnly";
import { useColorMode } from "@docusaurus/theme-common";
import { createTheme, ThemeProvider } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";

const TableRender = ({ columns, url, include = [], exclude = [] }): React.JSX.Element => {
	const [jsonContent, setJsonContent] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { colorMode } = useColorMode();

	const theme = useMemo(() => {
		const isLight = colorMode === "light";

		return createTheme({
			palette: {
				mode: colorMode,
				background: {
					default: isLight ? "rgb(255,255,255)" : "#1b1b1d",
				},
			},
		});
	}, [colorMode]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: exclude/include are stable
	useEffect(() => {
		setIsLoading(true);
		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				const updatedData = [];
				const names = new Set();

				for (const key of Object.keys(data)) {
					// filter duplicate names
					const item = data[key];
					const name = item.name;

					if (names.has(name)) {
						continue;
					}

					if (exclude.some((excluded) => name.includes(excluded))) {
						continue;
					}

					if (!include.every((included) => name.includes(included))) {
						continue;
					}

					names.add(name);
					updatedData.push({
						...item,
						// flattening list of strings into CSV strings to allow global filtering on them
						// /!\ requires special handling in the rendering side (see crowdsec-docs/docs/cti_api/taxonomy) /!\
						...(item.behaviors ? { behaviors: item.behaviors.join("\n") } : {}),
						...(item.mitre_attacks ? { mitre_attacks: item.mitre_attacks.join("\n") } : {}),
						...(item.cves ? { cves: item.cves.join("\n") } : {}),
					});
				}

				setJsonContent(updatedData);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			});
	}, [url]);

	if (!columns || (!jsonContent && !isLoading)) {
		return null;
	}

	return (
		<BrowserOnly>
			{() => (
				<ThemeProvider theme={theme}>
					<MaterialReactTable
						data={jsonContent}
						columns={columns}
						enableColumnResizing={false}
						initialState={{
							pagination: { pageSize: 25, pageIndex: 0 },
						}}
						enableGlobalFilter={true}
						muiPaginationProps={{
							rowsPerPageOptions: [10, 15, 25, 50, 100],
						}}
						state={{ isLoading }}
					/>
				</ThemeProvider>
			)}
		</BrowserOnly>
	);
};

export default TableRender;
