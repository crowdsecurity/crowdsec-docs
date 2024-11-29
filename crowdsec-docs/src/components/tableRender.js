import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider } from '@mui/material';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';


const TableRender = ({ columns, url, include=[], exclude=[] }) => {
    const [jsonContent, setJsonContent] = useState()
    const {colorMode} = useColorMode();

    const theme = useMemo(() => {
      const isLight = colorMode === 'light';

      return createTheme({
          palette: {
            mode: colorMode,
            background: {
              default:
                isLight
                  ? 'rgb(255,255,255)'
                  : '#1b1b1d',
            },
          },
        },
      );
    }, [colorMode]);


  useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const updatedData = [];
                const names = [];

                Object.keys(data).map((key, i) => {
                    // filter duplicate names
                    const item = data[key];
                    const name = item["name"];
                    for (let i = 0; i < exclude.length; i++) {
                        if (name.includes(exclude[i])) {
                            return
                        }
                    }
                    for (let i = 0; i < include.length; i++) {
                        if (!name.includes(include[i])) {
                            return
                        }
                    }
                    if (names.includes(name)) {
                        return
                    }

                    names.push(name)
                    updatedData.push({
                      ...item,
                      // flattening list of strings into CSV strings allow global filtering on them
                      // /!\ it requires special handling in the rendering side (see crowdsec-docs/docs/cti_api/taxonomy) /!\
                      ...item.behaviors ? { behaviors: item.behaviors.join('\n') } : {},
                      ...item.mitre_attacks ? { mitre_attacks: item.mitre_attacks.join('\n') } : {},
                      ...item.cves ? { cves: item.cves.join('\n') } : {},
                    });
                });

                setJsonContent(updatedData);
            })
    // execute this fetch only once (on mount)
    }, []);

    if (!columns || !jsonContent) {
        return <></>
    }

    return (
        <BrowserOnly>
            {() =>
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
                    />
                </ThemeProvider>
            }
        </BrowserOnly>
    );

}

export default TableRender;


