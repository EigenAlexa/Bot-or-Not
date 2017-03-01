import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Button, Modal } from 'react-bootstrap';

export default class ClosedPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
			submitted: false, 
			rating: 'bot', 
			canClose: false,
      onRating: false,
		};
  }
  
  componentWillUpdate(){
    if(!this.props.userLeft && !this.state.onRating){
      console.log("setting state");
      this.setState({onRating: true});
    }
  }
  renderUserLeft() {
    return ( <div>
            <span className="update-span">Sorry the other user left, please feel free to join another chat.</span>
             {this.renderNextChatButton()}
             </div>
             );
  }
  renderUserLeftSubmitted() {
    return ( <div>
              <p> Thanks for rating. Unfortunately, the other user left with out rating you. Please feel free to join another chat. </p>
              {this.renderNextChatButton()}
              </div>
        );
  }
  renderThanksForRating() {
    return ( <div>
              <p> Thanks for rating. Please feel free to join another chat. </p>
              {this.renderNextChatButton()}
              </div>
        );
  }
  handleSubmit(event) {
    event.preventDefault();
    const target = event.target;
    console.log('submitting', target.name);
    Meteor.call('convos.updateRatings', this.props.room._id, Meteor.userId(), target.name); 
    this.setState({submitted: true, rating: target.name});
		this.setState({canClose : true});
    Tracker.autorun((comp) => {
      user = Meteor.users.findOne({_id: Meteor.userId()});
      console.log("user.rated", user.rated);
      if(user.rated){
        Session.set('playNotification', "true");
        Session.set('rating', user.lastRating);
        comp.stop();
      }
    });
    //FlowRouter.go('/');
  }
	renderModal(title,modalChild) {
    return (
        <Modal show={true} backdrop='static' >
          <Modal.Header> 
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalChild}
          </Modal.Body>
        </Modal>
    );
	}

  handleNextSubmit(event) {
    Meteor.call('users.exitConvo', Meteor.userId());
  }
  renderNotUserLeft() {
    let links = {
      url: "http://botornot.ml/",
      title: "BotOrNot",
    }
    return (<div>
        {!this.state.submitted ? this.renderBotOrNotButtons(): this.renderThanksForRating()}
		    {blazeToReact('shareit')(links)}
        </div>
    );
  }
  renderBotOrNotButtons(){
     return (<div><p> Thanks for playing. Please guess whether the other person was a bot or not. </p> 
        <Button name="bot" bsStyle="primary" bsSize='small' onClick={this.handleSubmit.bind(this)}>Bot</Button>
        <Button name="not" bsStyle="primary" bsSize='small' onClick={this.handleSubmit.bind(this)}>Not</Button>
        </div>);
  }
  renderWaitForRating(){
    return (<div><p> If you would like to see your rating, please wait for the other bot/human to rate you </p>
          {this.renderNextChatButton()}</div>);
  }
/*  renderRatings(){
    return (<div><p> You were rated {Meteor.user().lastRating} </p> 
          <p> You rated the other user {this.state.rating}. The other user was {Meteor.user().lastOtherUser} </p>
          {this.renderNextChatButton()}
          </div>);
  }
  */
  renderNextChatButton() {
    return (
        <Button bsStyle='primary' bsSize='large' onClick={this.handleNextSubmit.bind(this)}>Next Chat</Button>
        );
  }
  render() {
    const { room, connected, loading, userLeft } = this.props;
    if(!loading && userLeft && !this.state.onRating ){
      object = this.renderUserLeft();     
			title = "User Disconnected";
    } 
    /*else if(!loading && userLeft && this.state.submitted && !Meteor.user().rated){
      object = this.renderUserLeftSubmitted();
      title = "User Disconnected";
    } */
    else if(!loading && (!userLeft || this.state.onRating)){
      object = this.renderNotUserLeft();        
			title = "Conversation Ended";
    } else {
      object = (<p> Hang on a tick, this page is loading </p>);
			title = "Page loading";
    }
		return this.renderModal(title, object);
  }
}
ClosedPage.propTypes = {
    room: React.PropTypes.object,
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
    userLeft: React.PropTypes.bool
}
