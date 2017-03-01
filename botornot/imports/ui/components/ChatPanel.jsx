import { Panel } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

export default class ChatPanel extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom() {
    let panelNode = ReactDOM.findDOMNode(this.refs.chatPanel);
    panelNode.scrollTop = panelNode.scrollHeight;
  }
  
  componentDidUpdate(prevProps, prevState) {
    // TODO actually check for changes in messages
    this.scrollToBottom();
  }

  render() {
    let messages = this.props.messages;
    return <Panel className="message-panel" ref="chatPanel">{messages}</Panel>;
  }
}
