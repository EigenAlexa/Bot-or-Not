import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class ClosedPage extends React.Component {
  renderUserLeft() {
    return ( <p>Sorry the other user left, please feel free to join another chat.</p> );
  }
  handleSubmit(event) {
    event.preventDefault();
    const target = event.target;
    console.log(target.name);
    Meteor.call('convos.updateRatings', this.props.room._id, Meteor.userId(), target.name); 
    FlowRouter.go('/');

  }

  renderNotUserLeft() {
    let links = {
      url: "http://botornot.ml/",
      title: "BotOrNot",
    }
    console.log(this);
      // <Blaze template="shareit" />
    return (
      <div>
      <p> Thanks for playing. Please guess whether the other person was a bot or not. </p> 
      <button name="bot" className="button btn-primary" onClick={this.handleSubmit.bind(this)}>Bot</button>
      <button name="not" className="button btn-primary" onClick={this.handleSubmit.bind(this)}>Not</button>
		  {blazeToReact('shareit')(links)}
      </div>
    );
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
        { !loading ? content.bind(this)() : <p> Hang on a tick, this page is loading. </p> }
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
