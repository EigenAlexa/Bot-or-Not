import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

export default class ChatPage extends React.Component {
    getMeteorData() {
        var data = {};
        var roomId = this.props.roomId;
        var handle = Meteor.subscribe('room', roomId);
        if (handle.ready()){
            data.room = Room.findOne({_id: roomId});
        }
        return data;
    }
    render() {
        return (
            <div>
                <section className="section-background">
                  <div className="container">
                    <h3 className="page-header">
                    Chat
                    </h3>
                  </div> 
                </section> 
                { this.data.room? this.getContent() : <p> Please wait while we connect you to an available bot or human. </p> }
            </div>
        );
    }
}

