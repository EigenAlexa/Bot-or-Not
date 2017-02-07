import React, { PropTypes } from 'react';

class Screen extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

  componentDidMount() {
  //  require('/imports/ui/layouts/layout.jsx');
  //  Layout.currentScreenDidMount();
  }
}

export default Screen;