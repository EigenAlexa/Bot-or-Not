import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Button, ProgressBar, Modal } from 'react-bootstrap';
import { updateCookiesOnExit } from '/imports/startup/client/config.js';
import { Convos } from '/imports/api/convos/convos.js';

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
      this.setState({onRating: true});
    }
  }
  renderUserLeft() {
    return ( <div>
            <p>Sorry the other user left, please feel free to join another chat.</p>
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
    const xp = 46;
    const xp_max = 50;

    return ( <div className="ratingDiv">
              <p>The other user was </p>
              { !this.props.user.loading ?
                this.props.user.lastOtherUser == 'bot' ? <span className="feedback fb-bot">BOT</span> : <span className="feedback fb-not">NOT</span>
                : ""}
              <p> You gained +100xp for guessing correctly! </p>
              <ProgressBar active bsStyle="info xpBar" now={(xp/xp_max)*100} label={"XP "+ xp +"/" + xp_max} />
              {this.renderNextChatButton()}
              </div>
        );
  }
  handleSubmit(event) {
    event.preventDefault();
    const target = event.target;
    Meteor.call('convos.updateRatings', this.props.room._id, Meteor.userId(), target.name); 
    this.setState({submitted: true, rating: target.name});
		this.setState({canClose : true});
    Tracker.autorun((comp) => {
      user = Meteor.users.findOne({_id: Meteor.userId()});
      console.log(user.curConvo)
      convo = Convos.findOne({_id: user.curConvo });
      users = convo.users.filter((otherUser) => {
        return otherUser.id !== user._id;
      }).map((otherUser) => {
        return otherUser.id;
      });
      if (!!users && !!users[0]) {
        other = Meteor.users.findOne({_id: users[0]});
      }
      console.log("user.rated", user.rated);
      if(user.rated){
        Session.set('playNotification', "true");
        Session.set('rating', user.lastRating);
        comp.stop();
      } else if (!!other && other.curConvo !== user.curConvo){
        console.log("stopping autorun");
        comp.stop();
      }
    });
    //FlowRouter.go('/');
  }
	renderModal(title,modalChild) {
    return (
        <Modal show={true} backdrop='static' className="close-page-modal">
          <Modal.Header className="modal-header"> 
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalChild}
          </Modal.Body>
        </Modal>
    );
	}

  handleNextSubmit(event) {
    Meteor.call('users.exitConvo');
    updateCookiesOnExit();
  }
  renderNotUserLeft() {
    let links = {
      url: "http://botornot.ml/",
      title: "BotOrNot",
    }
    return (<div>
        {!this.state.submitted ? this.renderBotOrNotButtons(): this.renderThanksForRating()}
        </div>
    );
		    // {blazeToReact('shareit')(links)}
  }
  renderBotOrNotButtons(){
     return (<div>
        <Button id="botbutton" name="bot" bsStyle="primary" bsSize='large' className='btn-alt btn-bot-not' onClick={this.handleSubmit.bind(this)}>Bot</Button>
        <Button id="notbutton" name="not" bsStyle="primary" bsSize='large' className='btn-bot-not' onClick={this.handleSubmit.bind(this)}>Not</Button>
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
        <Button bsStyle='primary' id="next-chat"  bsSize='large' className='btn-full-modal' onClick={this.handleNextSubmit.bind(this)}>Next Chat</Button>
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
      if (!this.state.submitted) {
        object = this.renderBotOrNotButtons();
        title = "Please Rate the Other Player";
      }
      else {
        object = this.renderThanksForRating();        
        title= "Thanks for Rating";
      }
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
    userLeft: React.PropTypes.bool,
    user: React.PropTypes.object,
}
