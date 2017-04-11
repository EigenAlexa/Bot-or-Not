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
      this.state = {
        isLoading: false, 
        index: 0, 
        inputValidState: null, 
        errorMsgs: null, 
        progress:0.0, 
        time_pass: 0.0,
        focusInput : false,
        firstChatRender: true,
       };
      this.handleOffTopicButton = this.handleOffTopicButton.bind(this);

      this.updateLoadingInterval = this.updateLoadingInterval.bind(this);
      this.loadingInterval = Meteor.setInterval(this.updateLoadingInterval, (!!Meteor.settings.public.tipSpeed ? Meteor.settings.public.tipSpeed : 2000));
    }
    
    updateLoadingInterval() {
      if(this.state.index < this.snippets.length - 1){
        this.setState({index: this.state.index + 1});
      }
      else{
        this.setState({'index': 0});
      }
    }
    
    componentDidMount(){
      window.addEventListener("beforeunload", this.beforeunload);
      window.addEventListener("unload", this.unload); 
    }
    
    componentWillUnmount(){
      window.removeEventListener("beforeunload", this.beforeunload);
      window.addEventListener("unload", this.unload);
      Meteor.clearInterval(this.progressInterval)
      Meteor.clearInterval(this.loadingInterval);
    }
    
    componentDidUpdate(prevProps, prevState){
      if (this.state.focusInput ) {
        ReactDOM.findDOMNode(this.refs.textInput).focus();
        this.setState({
          focusInput : false
        });
      }
    }
    
    beforeunload(event){
      event.returnValue="Are you sure you want to leave";
    }
    
    getContent() {
	      if (! this.props.roomExists) {
            return (<div> <p>404d, Please refresh</p> </div>);
        }
        isReady = true;
        this.props.room.users.forEach((user) => {
          isReady = isReady && user.isReady;
        });
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
        const showBot = this.props.room.turns > Meteor.settings.public.ratingTurns && !this.props.room.closed;
        const rateButtonClass = showBot ? "" : "btn-disabled";
        return (<div className="col-sm-12">
                  <div className="col-sm-12 col-md-9">
                  <div id="modal-div"> </div>
                    <ChatPanel messages={Messages}/>
                    <div className="progress-input row">
                    {this.props.room.closed ? "": this.renderChatInput()}
                    {this.props.room.closed && user.convoClosed ? this.renderClosed() : "" }
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 protip-side">
                    <Button bsStyle='primary' size='medium' className={"rate-now " + rateButtonClass} onClick={this.handleRateButton.bind(this)} >Rate Now</Button>
                    <p className="word-wrap pro-tip hidden-xs"><b> Pro Tip: </b>{this.snippets[this.state.index] }</p> 
                  </div>
                </div>);

                    // <Button bsStyle='primary' size='medium' onClick={this.handleOffTopicButton.bind(this)}>Off Topic</Button>
    }
    
    getLoadingPage() {
        return (<div className="loading-btn"> <h3>Loading, hang tight !</h3></div>);
    }
    
    handleNextChat(event){
      Meteor.call('users.exitConvo');
      updateCookiesOnExit();
    }
    
    handleRateButton(event) {
      if (this.props.room.turns >= Meteor.settings.public.ratingTurns) {
        Meteor.call('convos.finishConvoUserStayed', this.props.room._id);
      } else {
        Session.set('turnsLeft', Meteor.settings.public.ratingTurns - this.props.room.turns);
        Session.set('notifyNumTurns', "true");
      }
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
        Meteor.call('convos.updateChat', text, this.props.room._id);
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
      if (this.state.firstChatRender) {
        this.setState({
          focusInput :true,
          firstChatRender: false,
        });
      }
      return (
        <FormGroup validationState={this.state.inputValidState}>
        <ControlLabel>{this.state.errorMsgs}</ControlLabel> 
        <FormControl type="text" ref="textInput" placeholder="Type to send message" onKeyPress={this.handleKeystroke.bind(this)}/>
        </FormGroup>
      );
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

