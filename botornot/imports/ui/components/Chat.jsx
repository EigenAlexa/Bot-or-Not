import React from 'react';
import ReactDOM from 'react-dom';
import Message from '/imports/ui/components/Message.jsx';
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { _ } from 'meteor/underscore';
import { Panel, FormControl, ProgressBar, Button, FormGroup, ControlLabel, Modal } from 'react-bootstrap';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';
import Snippets from '/imports/ui/static/LoadingSnippets.jsx';
import ChatPanel from '/imports/ui/components/ChatPanel.jsx';
import { updateCookiesOnExit } from '/imports/startup/client/config.js';

export default class Chat extends React.Component {
    constructor(props) {
      super(props);
      this.handleEnter = _.debounce(this.handleEnter, 100, false);
      this.snippets = Snippets;
      this.state = {isLoading: false, 
                    index: 0, 
                    inputValidState: null, 
                    errorMsgs: null, 
                    progress:0.0, 
                    time_pass: 0.0,
       };
      this.updateLoadingInterval = this.updateLoadingInterval.bind(this);
      this.loadingInterval = Meteor.setInterval(this.updateLoadingInterval, 5000);
      this.updateProgressBar = this.updateProgressBar.bind(this);
      this.handleOffTopicButton = this.handleOffTopicButton.bind(this);
      this.progressInterval = Meteor.setInterval(this.updateProgressBar, 50);
    }
    updateLoadingInterval() {
        if(this.state.index < this.snippets.length - 1){
          this.setState({index: this.state.index + 1});
        }
    }
    updateProgressBar() {
         var n = this.state.time_pass;
         var new_time = (n+0.05);
         this.setState({'time_pass': new_time});
         this.setState({'progress': 97.0 - 97/(new_time)});
    }
    componentDidMount(){
      window.addEventListener("beforeunload", this.beforeunload);
      window.addEventListener("unload", this.unload); 
    }
    componentWillUnmount(){
      window.removeEventListener("beforeunload", this.beforeunload);
      window.addEventListener("unload", this.unload);
      Meteor.clearInterval(this.loadingInterval);
      Meteor.clearInterval(this.progressInterval);
    }
    beforeunload(event){
      event.returnValue="Are you sure you want to leave";
    }
    getContent() {
	      if (! this.props.roomExists) {
            return (<div> <p>404'd</p> </div>);
        }
        isReady = true;
        this.props.room.users.forEach((user) => {
          isReady = isReady && user.isReady;
        });
        if (this.props.room.curSessions < 2 || !isReady && !this.props.room.closed){
          return this.renderPrepScreen();
        }
        messages = this.props.messages;
        Messages = messages.map(msg => {
          className = msg.user == Meteor.userId() ? "from-me" : "from-them";
          //user = Meteor.users.findOne({_id: msg.user}).username;
          return(
            <Message 
                key={msg._id}
                msg={msg.message} 
                msgClass={className}
            />
        )});
        user = Meteor.user();
        return (<div>
                  <div id="modal-div"> </div>
                    <ChatPanel messages={Messages}/>
                    <div className="progress-input row">
                    {this.props.room.closed ? "": this.renderChatInput()}
                    {this.props.room.closed || this.props.room.canRate ? "": this.renderProgressBar()}
                    {this.props.room.closed || this.props.room.canRate ? "": <Button bsStyle='primary' size='medium' onClick={this.handleNextChat.bind(this)}>Next Chat</Button>} 
                    {this.props.userOffTopic ? "": <Button bsStyle='primary' size='medium' onClick={this.handleOffTopicButton.bind(this)}>Off Topic</Button>} 
                    {!this.props.room.closed && this.props.room.canRate ? <Button bsStyle='primary' size='medium' onClick={this.handleRateButton.bind(this)}>Finish and Rate</Button>: ""} 
                    {this.props.room.closed && user.convoClosed ? this.renderClosed() : "" }
                    </div>
                  </div>);

    }
    getLoadingPage() {
        return (<div> <h1>Loading, hang tight.</h1></div>);
    }
    handleNextChat(event){
      Meteor.call('users.exitConvo', Meteor.userId());
      updateCookiesOnExit();
    }
    handleRateButton(event) {
      Meteor.call('convos.finishConvo', this.props.room._id);
      Meteor.call('convos.finishConvoUsers', this.props.room._id);
    }
    handleOffTopicButton(event) {
      Session.set('curConvo', this.props.room._id);
      Session.set('notifyOffTopic', 'true');
    }
    handleEnter(event) {
      event.preventDefault();
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      result = validate(text, this.props.room._id);
      if (result.valid) {
        this.setState({inputValidState: null, errorMsgs: null});
        Meteor.call('convos.updateChat', text, this.props.room._id, Meteor.userId());
      }else{
        this.setState({inputValidState: "error", errorMsgs: result.errors});
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
        <ProgressBar active now={progress} label={`${progress}%`}/>
      );
    }
    renderClosed(){
      user = Meteor.users.findOne({_id:Meteor.userId()});
      return( <ClosedPageContainer params={{roomId: user.curConvo, userLeft: user.left}} /> );
    }
    renderPrepScreen(){
      firstTime = Meteor.user().firstTime;
      readyToChat = this.props.room.curSessions == 2 && (!firstTime || this.state.index == this.snippets.length - 1);
      if(readyToChat){
        Meteor.clearInterval(this.loadingInterval);  
        Meteor.clearInterval(this.progressInterval);  
        Meteor.call('convos.makeReady', this.props.room._id, Meteor.userId());
      }
      isLoading = Convos.findOne({_id: this.props.room._id}).users.filter((user) => {return user.id == Meteor.userId()})[0].isReady;
      progress = this.state.progress;
      return (
        <div className="loading-btn word-wrap">
        {isLoading ? "" : <h3>Looking for chat rooms</h3>}
        <h4 className="word-wrap"><b> Pro Tip: </b>{this.snippets[this.state.index] }</h4>
        <div className="progress-for-loader">
          <ProgressBar  now={progress} active striped bsStyle={isLoading ? "success" : "info"} 
          label={isLoading ? "Connnected! Waiting on other user."
          : ""}/> 
        </div>
        </div>);
    }
   /* renderPrompt(){
      return (<p>{this.props.room.promptText}</p>);
    }*/
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

