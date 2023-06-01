import React from 'react';

class ClassificationRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonContent: {}
        }
        fetch('https://hub-cdn.crowdsec.net/scenario_taxonomy/taxonomy/classifications.json')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ jsonContent: data })
            })
    }

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Label </th>
                        <th> Description </th>
                    </tr>
                </thead>
                {
                    Object.values(this.state.jsonContent).map((value, i) => {
                        return (
                            <tr>
                            <td>{value["name"]}</td>
                            <td>{value["label"]}</td>
                            <td>{value["description"]}</td>
                            </tr>
                        )
                    })
                }
            </table>
        );
    }
}

export default ClassificationRender;


