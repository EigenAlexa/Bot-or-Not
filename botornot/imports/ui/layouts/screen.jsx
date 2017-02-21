import React, { PropTypes } from 'react';
import NavBarContainer from '/imports/ui/containers/NavBarContainer.jsx';
export default class Screen extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <NavBarContainer /> 
                </header>
                <body>
                    {this.props.children}
                </body>
            </div>
        );
    }
}
