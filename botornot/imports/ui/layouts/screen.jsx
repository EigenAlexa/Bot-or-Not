import React, { PropTypes } from 'react';
import NavBar from '/imports/ui/screens/navbar.jsx';
export default class Screen extends React.Component {
    render() {
        return (
            <div>
                <NavBar /> 
                {this.props.children}
            </div>
        );
    }
}

