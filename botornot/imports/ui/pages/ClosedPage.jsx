import React from 'react';
import {_} from 'meteor/underscore';

export default class ClosedPage extends React.Component {
  renderUserLeft() {
    return ( <p>Sorry the other user left, please feel free to join another chat.</p> );
  }

  renderNotUserLeft() {
    
  }
  renderBoilerPlate(loading, content) {
    return (
      <div>
        <section className="section-background">
          <div className="container">
            <h3 className="page-header">
              Chat
            </h3>
          </div>
        </section>
        { !loading ? content() : <p> Hang on a tick, this page is loading. </p> }
      </div>
    ); 
  }
  render() {
    const { room, connected, loading, userLeft } = this.props;
    
    if(!loading && userLeft){
      return this.renderBoilerPlate(loading, this.renderUserLeft);     
    } else if(!loading && !userLeft){
      return this.renderBoilerPlate(loading, this.renderNotUserLeft);        
    } else {
      return this.renderBoilerPlate(true, null);
    }
  }
}
ClosedPage.propTypes = {
    room: React.PropTypes.object,
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
    userLeft: React.PropTypes.bool
}
