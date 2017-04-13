import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';
import { ProfileSideContainer } from '/imports/ui/containers/ProfileContainer.jsx';
import { cookies } from '/imports/startup/client/config.js';
import { Convos } from '/imports/api/convos/convos.js';
import { Random } from 'meteor/random';

export default class WaitPage extends React.Component {
    constructor(props) {
      super(props);
      //this.makeOrJoinRoom = _.debounce(this.makeOrJoinRoom, 5000);
    }


    getContent() {
        const roomId = this.props.user.curConvo;
        const userId = Meteor.userId();
        // render all messages
        // render the input box
        return ( <ChatContainer params={{ id: {room: roomId, user: userId} }}/> );
    }
    
    joinQueue() {
      Meteor.call('users.addUserToQueue');
    }

    renderPrepScreen(){
      return (
        <div className="loading-btn word-wrap">
        
        <div className="progress-for-loader">
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>
      </div>);
    }

    render() {
        const { connected, loading, user } = this.props;
        let child = this.renderPrepScreen;
        if(!loading && !user){
          AccountsAnonymous.login((e) => {
            Meteor.call('users.updateAnonymousUsername');
          });
        } else if(!loading && !!user && !this.resetting){
          if (!user.in_convo) {
            this.joinQueue();
          } 
          else {
            child = this.getContent;
          } 
          inconvo = user.in_convo;
        }

        const username = !!Meteor.user() ? Meteor.user().username : null;
        
        return (
          <div className="container-with-sidebar">
            <ProfileSideContainer params={{ params: {username: username}}} />
            <div className="chat-frame">
              <div className="container-fluid">
                <h2 className="page-header">
                  CHAT
                </h2>
                <div className ="row">
                  <div>
                    {child.bind(this)()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

WaitPage.propTypes = {
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
    user: React.PropTypes.object
}
