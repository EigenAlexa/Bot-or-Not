import React, { PropTypes } from 'react';
// import {Layout} from '/imports/ui/layouts/layout.jsx';

class Screen extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

  componentDidMount() {
   // Layout.currentScreenDidMount();
  }
}

export default Screen;