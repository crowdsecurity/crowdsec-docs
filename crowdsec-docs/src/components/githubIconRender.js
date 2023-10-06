import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useEffect } from "react";


class GithubIconRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: "black" };
    }

    componentDidMount() {
        if (localStorage.getItem("theme") == "dark") {
            this.setState({color: "white"});
        } else {
            this.setState({color: "black"});
        }    
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.color != this.state.color) {
            if (localStorage.getItem("theme") == "dark") {
                this.setState({color: "white"});
            } else {
                this.setState({color: "black"});
            }
        }
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'center', flex: '1' }}>
                    <a href={this.props.url} target="_blank"><FontAwesomeIcon icon={faGithub} size="2x" color={this.state.color} />  </a>
                    <p>Github</p>
                </div>
            </div>
        )
    }
}

export default GithubIconRender;


