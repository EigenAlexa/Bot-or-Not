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
//    makeOrJoinRoom() {
//        // checks whether there is an open room and returns that. Otherwise
//        // will make a new room.
//        noRooms = this.props.openRooms.length === 0;
//        if (noRooms && !this.makingNewRoom) {
//          console.log('making a new room');
//          this.makingNewRoom = true;
//          Meteor.call('convos.newRoom', (error, result) => {
//            console.log(result, 'newroom id on callback');
//            Meteor.call('convos.addUserToRoom', result, (error, result)=>{this.makingNewRoom = false});
//          });
//        } else if (!this.makingNewRoom){
//          this.joinRoom();
//        } 
//    }
    
    joinQueue() {
      Meteor.call('users.addUserToQueue');
    }

//    joinRoom() {
//      this.room = this.props.openRooms[0];
//      cookies.set('convoroute', this.room.hostID);
//      cookies.send();
//      console.log('add user', Meteor.userId(), 'to room', this.room._id);
//      Meteor.call('convos.addUserToRoom', this.room._id);
//    }
//
//    resetRoom() {
//      console.error("RESETTING ROOM");
//        exitCb = (error, result) => {
//          console.error("EXITING CONVO user: " + Meteor.userId());
//          //Meteor._sleepForMs(Random.fraction() * 50);
//          this.room = null;
//          //this.forceUpdate();
//          this.resetting = false; 
//        }
//        Meteor.call('users.exitConvo', exitCb.bind(this));
//      this.resetting = true;
//    }

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
        const { openRooms, connected, loading, user } = this.props;
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
            console.log("trying to go to chat page");
            child = this.getContent;
            //convo = Convos.findOne({_id: user.curConvo});
            //if (this.props.openRooms.length > 1 && !!Convos.find({_id: this.room._id, curSessions: {$lt: 2}, closed: false })){
            //  this.resetTimeout = Meteor.setTimeout(this.resetRoom(), Random.fraction() * 200);
            //  user.in_convo = false
            //  //this.resetting = true;
            //  child = this.renderPrepScreen;
            //}
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
    openRooms: React.PropTypes.array,
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
    user: React.PropTypes.object
}
