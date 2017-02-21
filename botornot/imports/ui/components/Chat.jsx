import React from 'react';

export default class Chat extends React.Component {
    getContent() {
        if (! this.props.roomExists) {
            return (<div> <p>404'd</p> </div>);
        }
        messages = this.props.messages;
        Messages = messages.map(msg => (
            <Message 
                msg={msg} 
                author={msg.author}
                text={msg.text}
            />
        ));
        return (<div> {Messages} </div>);
    }
    getLoadingPage() {
        return (<div> <h1>sd</h1></div>);
    }
    
    render() {
        const { messages, loading, roomExists, connected }  = this.props;

        return loading ? this.getLoadingPage() : this.getContent();
    }
}

Chat.propTypes = {
    room : React.PropTypes.object,
    messages: React.PropTypes.array,
    loading: React.PropTypes.bool,
    roomExists : React.PropTypes.bool, 
    connected : React.PropTypes.bool
};

