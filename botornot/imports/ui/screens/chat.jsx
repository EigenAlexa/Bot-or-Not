import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import ChatRender from './chatRender.jsx';
var ChatPage = React.createClass({
  render: function() {
    return (
      <div>
        <section className="section-background">
          <div className="container">
            <h2 className="page-header">
              Chat
            </h2>
          </div> 
        </section> 
     <ChatRender />
      </div>
    );
  }
});

export default ChatPage;
