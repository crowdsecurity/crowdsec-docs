import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';


const TableRender = ({ columns, url }) => {

    const [jsonContent, setJsonContent] = useState()

    const globalTheme = useTheme();

    const currentTheme = localStorage.getItem('theme')
    const isLight = currentTheme === 'light'

    const tableTheme =
        createTheme({
            palette: {
                mode: currentTheme, //let's use the same dark/light mode as the global theme
                background: {
                    default:
                        isLight
                            ? 'rgb(255,255,255)' //random light yellow color for the background in light mode
                            : '#000', //pure black table in dark mode for fun
                },
            },
        },
        )

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                var newData = [];
                var names = [];
                Object.keys(data).map((key, i) => {
                    // filter duplicate names
                    var name = data[key]["name"];
                    if (names.includes(name)) {
                        return
                    }
                    names.push(name)
                    newData.push(data[key]);
                })
                setJsonContent(newData)
            })
    })

    if (!columns || !jsonContent) {
        return <></>
    }

    return (
        <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
                data={jsonContent}
                columns={columns}
                enableColumnResizing={true}
            />
        </ThemeProvider>
    );

}

export default TableRender;


