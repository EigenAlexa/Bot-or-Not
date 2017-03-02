import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';

export default class WaitPage extends React.Component {
    getContent() {
        const roomId = this.room._id;
        const userId = Meteor.userId();
        // render all messages
        // render the input box
        return ( <ChatContainer params={{ id: {room: roomId, user: userId} }}/> );
    }
    makeRoom() {
        // checks whether there is an open room and returns that. Otherwise
        // will make a new room.
        Meteor.call('convos.newRoom');
    }
    joinRoom() {
        this.room = this.props.openRooms[0];
        Cookie.set('convo', this.room._id);
        Meteor.call('convos.addUserToRoom', Meteor.userId(), this.room._id);
    }
    render() {
        const { openRooms, connected, loading, user } = this.props;
        if(!loading && !user){
          AccountsAnonymous.login((e) => {
            Meteor.call('users.updateAnonymousUsername', Meteor.userId());
          });  
        } else if(!loading && !!user){
          noRooms = openRooms.length === 0 && !user.in_convo;
          if (noRooms) {
            this.makeRoom();
          } else if (!user.in_convo) {
            this.joinRoom();
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
