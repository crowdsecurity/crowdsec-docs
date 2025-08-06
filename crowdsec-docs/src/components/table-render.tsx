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

	// Memoize the include and exclude arrays to prevent unnecessary re-renders
	const memoizedInclude = useMemo(() => include, [JSON.stringify(include)]);
	const memoizedExclude = useMemo(() => exclude, [JSON.stringify(exclude)]);

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
				const names = [];

				Object.keys(data).forEach((key) => {
					// filter duplicate names
					const item = data[key];
					const name = item.name;
					for (const element of memoizedExclude) {
						if (name.includes(element)) {
							return;
						}
					}
					for (const element of memoizedInclude) {
						if (!name.includes(element)) {
							return;
						}
					}
					if (names.includes(name)) {
						return;
					}

					names.push(name);
					updatedData.push({
						...item,
						// flattening list of strings into CSV strings allow global filtering on them
						// /!\ it requires special handling in the rendering side (see crowdsec-docs/docs/cti_api/taxonomy) /!\
						...(item.behaviors ? { behaviors: item.behaviors.join("\n") } : {}),
						...(item.mitre_attacks ? { mitre_attacks: item.mitre_attacks.join("\n") } : {}),
						...(item.cves ? { cves: item.cves.join("\n") } : {}),
					});
				});

				setJsonContent(updatedData);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			});
		// Only re-fetch when url, include, or exclude actually change
	}, [url, memoizedInclude, memoizedExclude]);

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
