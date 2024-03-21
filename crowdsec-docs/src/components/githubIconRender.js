import React from 'react';
import { cibGithub } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

class GithubIconRender extends React.Component {

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'center', flex: '1' }}>
                    <a href={this.props.url} target="_blank" className="dark:tw-text-white tw-text-black">
                        <CIcon icon={cibGithub} size="xxl" />
                    </a>
                    <p>Github</p>
                </div>
            </div>
        )
    }
}

export default GithubIconRender;


