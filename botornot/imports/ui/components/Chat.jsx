import React from 'react';
import ReactDOM from 'react-dom';
import Message from '/imports/ui/components/Message.jsx';
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { _ } from 'meteor/underscore';
import { FormControl, ProgressBar, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';
import Snippets from '/imports/ui/static/LoadingSnippets.jsx';

export default class Chat extends React.Component {
    constructor(props) {
      super(props);
      this.handleEnter = _.debounce(this.handleEnter, 100, false);
      this.state = {isLoading: false};
      this.snippets = Snippets;
      this.state = {isLoading: false, index: 0, inputValidState: null, errorMsgs: null};
      loadingInterval = Meteor.setInterval(() => {
        if(this.state.index < this.snippets.length - 1){
          console.log(this.state.index);
          this.setState({index: this.state.index + 1});
        }
      }, 5000);
    }
    getContent() {
        if (! this.props.roomExists) {
            return (<div> <p>404'd</p> </div>);
        }
        console.log(this.props.room);
        isReady = true;
        this.props.room.users.forEach((user) => {
          isReady = isReady && user.isReady;
          console.log(isReady);
        });
        if (this.props.room.curSessions < 2 || !isReady){
          return this.renderPrepScreen();
        }
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

        return (<div>
                  {this.renderPrompt()} 
                  <p>Discussion:</p>{Messages}
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
        result = validate(text);
        if (result.valid) {
          this.setState({inputValidState: null, errorMsgs: null});
          Meteor.call('convos.updateChat', text, this.props.room._id, Meteor.userId());
        }else{
          this.setState({inputValidState: "error", errorMsgs: result.errors});
          console.log(result.errors);
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
        <FormGroup validationState={this.state.inputValidState}>
        <ControlLabel>{this.state.errorMsgs}</ControlLabel> 
        <FormControl type="text" ref="textInput" placeholder="Type to send message" onKeyPress={this.handleKeystroke.bind(this)}/>
        </FormGroup>
      );
    }
    handleClick(event) { 
      Meteor.call('convos.makeReady', this.props.room._id, Meteor.userId());
    }
    renderProgressBar(){
      progress = this.props.room.turns / this.props.room.max_turns * 100;
      return (
        <ProgressBar now={progress} label={`${progress}%`}/>
      );
    }
    renderClosed(){
      user = Meteor.users.findOne({_id:Meteor.userId()});
      return( <ClosedPageContainer params={{roomId: user.curConvo, userLeft: user.left}} /> );
    }
    renderPrepScreen(){
      firstTime = Meteor.user().firstTime;
      showButton = this.props.room.curSessions == 2 && (!firstTime || this.state.index == this.snippets.length - 1);
      if(showButton){
        Meteor.clearInterval(loadingInterval);  
      }
      isLoading = Convos.findOne({_id: this.props.room._id}).users.filter((user) => {return user.id == Meteor.userId()})[0].isReady;
      progress = this.state.index / this.snippets.length * 100;
      return (
        <div>
        <p>{this.snippets[this.state.index] }</p>
        {showButton ?
        <Button bsStyle="primary" disabled={isLoading} onClick={isLoading ? null: this.handleClick.bind(this)}> 
        {isLoading ? "Loading ..." : "Continue" }
        </Button> : <ProgressBar now={progress} active striped bsStyle="info"/> }
        </div>);
    }
    renderPrompt(){
      return (<p>{this.props.room.promptText}</p>);
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

