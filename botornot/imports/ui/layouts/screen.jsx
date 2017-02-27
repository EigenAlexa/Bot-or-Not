import React, { PropTypes } from 'react';
import NavBar from '/imports/ui/components/NavBar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
export default class Screen extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <NavBar /> 
                </header>
                    {this.props.children}
              <Footer />
            </div>
        );
    }
}
