import React from 'react';
import {_} from 'meteor/underscore';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';
export default class WaitPage extends React.Component {
    getContent() {
        const roomId = this.room._id;
        console.log(roomId);
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
        this.room = this.props.openRooms[0];
    }
    render() {
        const { openRooms, connected, loading } = this.props;
        const noRooms = openRooms.length === 0;
        if (!loading && noRooms) {
            this.makeRoom();
        } else if (!loading && !noRooms) {
            this.joinRoom();
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
                { !noRooms? this.getContent() : <p> Please wait while we connect you to an available bot or human. </p> }
            </div>
        );
    }
}
WaitPage.propTypes = {
    openRooms: React.PropTypes.array,
    connected : React.PropTypes.bool,
    loading: React.PropTypes.bool,
}
