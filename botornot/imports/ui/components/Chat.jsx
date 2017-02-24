import React from 'react';
import ReactDOM from 'react-dom';
import Message from '/imports/ui/components/Message.jsx';
import { Convos } from '/imports/api/convos/convos.js';
import { _ } from 'meteor/underscore';
import { FormControl, ProgressBar } from 'react-bootstrap';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';

export default class Chat extends React.Component {
    constructor(props) {
      super(props);
      this.handleEnter = _.debounce(this.handleEnter, 100, false);
    }
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
        user = Meteor.user();

        return (<div> <p>Messages:</p>{Messages}
                  {this.props.room.closed ? "": this.renderChatInput()}
                  {this.props.room.closed ? "": this.renderProgressBar()} 
                  {this.props.room.closed && user.convoClosed ? this.renderClosed() : "" }
                  </div>);
    }
    getLoadingPage() {
        return (<div> <h1>Loading, hang tight.</h1></div>);
    }
    handleEnter(event) {
      event.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        if (text.length > 0) {
          Meteor.call('convos.updateChat', text, this.props.room._id);
        }
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }
    handleKeystroke(event) {
      if (event.charCode == 13){
        event.persist();
        this.handleEnter.bind(this)(event);
      }
    }
    renderChatInput(){
      return (
          <FormControl type="text" ref="textInput" placeholder="Type to send message" onKeyPress={this.handleKeystroke.bind(this)}/>
      );
    }
    renderProgressBar(){
      progress = this.props.room.length / 3 * 100;
      return (
        <ProgressBar now={progress} label={`${progress}%`}/>
      );
    }
    renderClosed(){
      user = Meteor.users.findOne({_id:Meteor.userId()});
      return( <ClosedPageContainer params={{roomId: user.curConvo, userLeft: user.left}} /> );
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

