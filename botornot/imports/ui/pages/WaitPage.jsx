import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';

export default class WaitPage extends React.Component {
    constructor(props) {
      super(props);
      this.makeOrJoinRoom = _.debounce(this.makeOrJoinRoom, 500);
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
        console.log('making a room');
        noRooms = this.props.openRooms.length === 0;
        if (noRooms) {
          console.log('making a new room');
          Meteor.call('convos.newRoom', (error, result) => {
            console.log(result._id, 'newroom id on callback');
            Meteor.call('convos.addUserToRoom', Meteor.userId(), result._id);
          });
        } else {
          this.joinRoom()
        }
    }
    joinRoom() {
        this.room = this.props.openRooms[0];
        Cookie.set('convoroute', this.room.hostID);
        Meteor.call('convos.addUserToRoom', Meteor.userId(), this.room._id);
    }
    render() {
        const { openRooms, connected, loading, user } = this.props;
        if(!loading && !user){
          console.log("anonymous");
          AccountsAnonymous.login((e) => {
            console.log("anonymous user logged in");
            Meteor.call('users.updateAnonymousUsername', Meteor.userId());
          });  
        } else if(!loading && !!user){
          console.log(user);
          if (!user.in_convo) {
            this.makeOrJoinRoom();
          }
          if (user.in_convo){
            this.room = {_id: user.curConvo}; 
          } 
          inconvo = user.in_convo;
        } else{
          noRooms = true;
          inconvo = false;
        }

        return (
            <div>
                <section className="section-background">
                  <div className="container">
                    <h2 className="page-header">
                    CHAT
                    </h2>
                  </div>
                </section>
                <div className="container">
                  { !noRooms || inconvo ? this.getContent() : <h4> Please wait while we connect you to an available bot or human. </h4>}
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
