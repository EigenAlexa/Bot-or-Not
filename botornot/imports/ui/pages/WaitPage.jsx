import React from 'react';
import {_} from 'meteor/underscore';

export default class WaitPage extends React.Component {
    getContent() {
        // Vvar data = {};
        // var roomId = this.props.roomId;
        // var handle = Meteor.subscribe('room', roomId);
        // if (handle.ready()){
        //     data.room = Room.findOne({_id: roomId});
        // }
        // return data;
        return ( <div> <p>Lol</p></div> );
    }
    makeRoom() {
        // checks whether there is an open room and returns that. Otherwise
        // will make a new room.
        console.log('making a room');
        Meteor.call('convos.newRoom');
    }
    render() {
        const { openRooms, connected, loading } = this.props;
        const noRooms = openRooms.length === 0;
        if (!loading && noRooms) {
            this.makeRoom();
        } else if (!loading && !noRooms) {

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
