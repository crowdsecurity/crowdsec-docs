import React from 'react';

class ScenarioRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonContent: {}
        }
        fetch('https://hub-cdn.crowdsec.net/scenario_taxonomy/taxonomy/scenarios.json')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ jsonContent: data })
            })
    }

    render() {
        return (
            <table style={{"width": "100%", "table-layout" : "fixed"}}>
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Label </th>
                        <th> Description </th>
                        <th> Behaviors </th>
                        <th> Mitre ATT&CK </th>
                        <th> CVEs </th>
                    </tr>
                </thead>
                <tbody>
                {
                    Object.values(this.state.jsonContent).map((value, i) => {
                        return (
                            <tr>
                            <td style={{"width": "10px"}}>{value["name"]}</td>
                            <td>{value["label"]}</td>
                            <td style={{"width": "500px"}}>{value["description"]}</td>
                            <td>{value["behaviors"].join("\n")}</td>
                            <td>{value["mitre_attacks"].join("\n")}</td>
                            <td>{"cves" in value? value["cves"].join("\n"): ""}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        );
    }
}

export default ScenarioRender;


