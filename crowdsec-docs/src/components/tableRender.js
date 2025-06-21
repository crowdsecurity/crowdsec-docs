import { useState, useEffect, useMemo } from "react"
import { MaterialReactTable } from "material-react-table"
import { createTheme, ThemeProvider } from "@mui/material"
import BrowserOnly from "@docusaurus/BrowserOnly"
import { useColorMode } from "@docusaurus/theme-common"

const TableRender = ({ columns, url, include = [], exclude = [] }) => {
    const [jsonContent, setJsonContent] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { colorMode } = useColorMode()

    const theme = useMemo(() => {
        const isLight = colorMode === "light"

        return createTheme({
            palette: {
                mode: colorMode,
                background: {
                    default: isLight ? "rgb(255,255,255)" : "#1b1b1d",
                },
            },
        })
    }, [colorMode])

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const updatedData = []
                const names = new Set()
                for (const key of Object.keys(data)) {
                    // filter duplicate names
                    const item = data[key]
                    const name = item["name"]

                    if (exclude.some((excluded) => name.includes(excluded))) {
                        continue
                    }

                    if (!include.every((included) => name.includes(included))) {
                        continue
                    }

                    if (names.has(name)) {
                        continue
                    }

                    names.add(name)
                    updatedData.push({
                        ...item,
                        // flattening list of strings into CSV strings to allow global filtering on them
                        // /!\ requires special handling in the rendering side (see crowdsec-docs/docs/cti_api/taxonomy) /!\
                        ...(item.behaviors
                            ? { behaviors: item.behaviors.join("\n") }
                            : {}),
                        ...(item.mitre_attacks
                            ? { mitre_attacks: item.mitre_attacks.join("\n") }
                            : {}),
                        ...(item.cves ? { cves: item.cves.join("\n") } : {}),
                    })
                }
                setJsonContent(updatedData)
                setIsLoading(false)
            })
        // execute this fetch only once (on mount)
    }, [])
    if (!columns || !jsonContent) {
        return <></>
    }
    return (
        <BrowserOnly>
            {() => (
                <ThemeProvider theme={theme}>
                    <MaterialReactTable
                        data={jsonContent}
                        columns={columns}
                        enableColumnResizing={false}
                        initialState={{ pagination: { pageSize: 25 } }}
                        enableGlobalFilter={true}
                        muiTablePaginationProps={{
                            rowsPerPageOptions: [10, 15, 25, 50, 100],
                        }}
                        getRowId={(row) => row.name}
                        state={{
                            isLoading: isLoading,
                        }}
                    />
                </ThemeProvider>
            )}
        </BrowserOnly>
    )
}

export default TableRender
