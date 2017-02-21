import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';
export default class WaitPage extends React.Component {
    getContent() {
        const roomId = this.room._id;
        // render all messages
        // render the input box
        return ( <ChatContainer params={{ id: {roomId} }}/> );
    }
    makeRoom() {
        // checks whether there is an open room and returns that. Otherwise
        // will make a new room.
        console.log('making a room');
        Meteor.call('convos.newRoom');
    }
    joinRoom() {
        console.log('joining a room');
        this.room = this.props.openRooms[0];
        Meteor.call('convos.addUserToRoom', Meteor.userId(), this.room._id);
    }
    render() {
        const { openRooms, connected, loading, user } = this.props;
        if(!loading && !!user){
          console.log(user);
         const noRooms = openRooms.length === 0 && !user.in_convo;
         console.log(noRooms);
         if (!loading && noRooms && !user.in_convo) {
              this.makeRoom();
          } else if (!loading && !noRooms && !user.in_convo) {
              this.joinRoom();
          }
         if (user.in_convo){
            this.room = {_id: user.curConvo}; 
         }
         inconvo = user.in_convo;
        
        }else{
          noRooms = true;
          inconvo = false;
        }

        return (
            <div>
                <section className="section-background">
                  <div className="container">
                    <h3 className="page-header">
                    Chat
                    </h3>
                  </div>
                </section>
                { !noRooms || inconvo ? this.getContent() : <p> Please wait while we connect you to an available bot or human. </p> }
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
