import React from 'react';
import ReactDOM from 'react-dom';
import Message from '/imports/ui/components/Message.jsx';
import { Convos } from '/imports/api/convos/convos.js';

export default class Chat extends React.Component {
    getContent() {
        if (! this.props.roomExists) {
            return (<div> <p>404'd</p> </div>);
        }
        console.log(this.props.room);
        messages = this.props.messages;
        Messages = messages.map(msg => {
          console.log("Loading: " + this.props.loading)
          console.log(Meteor.users.find().fetch());
          user = Meteor.users.findOne({_id: msg.user}).username;
          return(
            <Message 
                key={msg._id}
                msg={msg.message} 
                author={user}
            />
        )});

        return (<div> <p>Messages:</p>{Messages}
                  {this.renderChatInput()} 
                  </div>);
    }
    getLoadingPage() {
        return (<div> <h1>Loading, hang tight.</h1></div>);
    }
    handleSubmit(event) {
      event.preventDefault();

      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

      Meteor.call('convos.updateChat', text, this.props.room._id);
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    renderChatInput(){
      return (
          <form className="textForm" onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" ref="textInput" placeholder="Type to send message"/>
          </form>);
    }
    render() {
        const { room, messages, loading, roomExists, connected }  = this.props;
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

