import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class ClosedPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {submitted: false, rating: 'bot'};
  }
  renderUserLeft() {
    return ( <p>Sorry the other user left, please feel free to join another chat.</p> );
  }
  handleSubmit(event) {
    event.preventDefault();
    const target = event.target;
    console.log('submitting', target.name);
    Meteor.call('convos.updateRatings', this.props.room._id, Meteor.userId(), target.name); 
    this.setState({submitted: true, rating: target.name});
    //FlowRouter.go('/');
  }

  renderNotUserLeft() {
    let links = {
      url: "http://botornot.ml/",
      title: "BotOrNot",
    }
    console.log(this);
    return (<div>
        {Meteor.user().rated && this.state.submitted ? 
        <div><p> You were rated {Meteor.user().lastRating} </p> 
          <p> You rated the other user {this.state.rating}. The other user was {Meteor.user().lastOtherUser} </p>
          </div>
        : ""}
        {!this.state.submitted ?
        <div><p> Thanks for playing. Please guess whether the other person was a bot or not. </p> 
        <button name="bot" className="button btn-primary" onClick={this.handleSubmit.bind(this)}>Bot</button>
        <button name="not" className="button btn-primary" onClick={this.handleSubmit.bind(this)}>Not</button>
        </div>
        : ""}
        {!Meteor.user().rated && this.state.submitted ?
          <p> Please wait for the other bot/human to rate you </p>
            : ""}
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
      return this.renderUserLeft();     
    } else if(!loading && !userLeft){
      return this.renderNotUserLeft();        
    } else {
      return (<p> Hang on a tick, this page is loading </p>);
    }
  }
}
ClosedPage.propTypes = {
    room: React.PropTypes.object,
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
    userLeft: React.PropTypes.bool
}
