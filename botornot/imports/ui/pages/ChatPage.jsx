import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

export default class ChatPage extends React.Component {
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
    render() {
        return (
            <div>
                <section className="section-background">
                    <h3 className="page-header">
                    Chat
                    </h3>
                </section> 
                { !this.props.waiting? this.getContent() : <p> Please wait while we connect you to an available bot or human. </p> }
            </div>
        );
    }
}
ChatPage.propTypes = {
    convo: React.PropTypes.object,
    messages: React.PropTypes.array,
    waiting: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    convoExists: React.PropTypes.bool,
}
