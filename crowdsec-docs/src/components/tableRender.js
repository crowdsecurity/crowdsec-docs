import React from 'react';
import { MaterialReactTable } from 'material-react-table';


class TableRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonContent: {},
        }
        fetch(this.props.url)
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
                this.setState({ jsonContent: newData })
            })
    }

    render() {
        return (
            <MaterialReactTable
                data={this.state.jsonContent}
                columns={this.props.columns}
                enableColumnResizing={true}
            />            
        );
    }
}

export default TableRender;


