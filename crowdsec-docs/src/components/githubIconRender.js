import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


class GithubIconRender extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var color = "black";
        if (localStorage.getItem("theme") == "dark") {
            color = "white";
        }
        return (
            <div style={{display: 'flex'}}>
                <div style={{textAlign: 'center', flex: '1'}}>
                    <a href={this.props.url} target="_blank"><FontAwesomeIcon icon={faGithub} size="2x" color={color}/>  </a>
                    <p>Github</p>
                </div>
            </div>
        )
    }
}

export default GithubIconRender;


