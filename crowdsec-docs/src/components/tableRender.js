import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider } from '@mui/material';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';


const TableRender = ({ columns, url }) => {
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
                const newData = [];
                const names = [];

                Object.keys(data).map((key, i) => {
                    // filter duplicate names
                    const name = data[key]["name"];

                    if (names.includes(name)) {
                        return
                    }

                    names.push(name)
                    newData.push(data[key]);
                })
                setJsonContent(newData)
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
                        enableColumnResizing={true}
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


