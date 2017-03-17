import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';
import { ProfileSideContainer } from '/imports/ui/containers/ProfileContainer.jsx';
import { cookies } from '/imports/startup/client/config.js';
import { Convos } from '/imports/api/convos/convos.js';

export default class WaitPage extends React.Component {
    constructor(props) {
      super(props);
      //this.makeOrJoinRoom = _.debounce(this.makeOrJoinRoom, 5000);
      this.resetRoom = _.debounce(this.resetRoom, 3000);
    }
    componentWillMount() {
      this.makingNewRoom = false;
    }
    getContent() {
        const roomId = this.room._id;
        const userId = Meteor.userId();
        // render all messages
        // render the input box
        return ( <ChatContainer params={{ id: {room: roomId, user: userId} }}/> );
    }
    makeOrJoinRoom() {
        // checks whether there is an open room and returns that. Otherwise
        // will make a new room.
        noRooms = this.props.openRooms.length === 0;
        if (noRooms && !this.makingNewRoom) {
          console.log('making a new room');
          this.makingNewRoom = true;
          Meteor.call('convos.newRoom', (error, result) => {
            console.log(error);
            console.log(result, 'newroom id on callback');
            Meteor.call('convos.addUserToRoom', Meteor.userId(), result, (error, result)=>{this.makingNewRoom = false});
          });
        } else if (!this.makingNewRoom){
          this.joinRoom();
        } 
    }
    joinRoom() {
        this.room = this.props.openRooms[0];
        cookies.set('convoroute', this.room.hostID);
        cookies.send();
        Meteor.call('convos.addUserToRoom', Meteor.userId(), this.room._id);
    }
    resetRoom() {
      Meteor.call('users.exitConvo', this.room._id, Meteor.userId());
      this.room = null;
      this.forceUpdate(); 
    }
    render() {
        const { openRooms, connected, loading, user } = this.props;
        if(!loading && !user){
          AccountsAnonymous.login((e) => {
            Meteor.call('users.updateAnonymousUsername', Meteor.userId());
          });  
        } else if(!loading && !!user){
          console.log(user);
          if (!user.in_convo) {
            this.makeOrJoinRoom();
          }
          if (user.in_convo){
            this.room = {_id: user.curConvo};
            convo = Convos.findOne({_id: user.curConvo});
            if (this.props.openRooms.length > 1 && !!Convos.find({_id: this.room._id, curSessions: {$lt: 2} })){
              this.resetRoom();
              user.in_convo = false;
            }
          } 
          inconvo = user.in_convo;
        } else{
          noRooms = true;
          inconvo = false;
        }
        const username = !!Meteor.user() ? Meteor.user().username : null;
        return (
          <div>
            <h2 className="page-header">
              CHAT
            </h2>
            <div className ="row">
                < ProfileSideContainer params={{ params: {username: username}}} />
              <div>
                { !noRooms || inconvo ? this.getContent() : ""}
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
