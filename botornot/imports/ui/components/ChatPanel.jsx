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
  componentDidMount() {
    let panelNode = ReactDOM.findDOMNode(this.refs.chatPanel);
    // panelNode.enscroll({
    //   showOnHover: false,
    // verticalTrackClass: 'track3',
    // verticalHandleClass: 'handle3'
// });

  }
  componentDidUpdate(prevProps, prevState) {
    // TODO actually check for changes in messages
    this.scrollToBottom();
  }
    
  render() {
    let messages = this.props.messages;
    let panel = (<Panel className="message-panel" ref="chatPanel">{messages}</Panel>);
  
    return panel;
  }
}
