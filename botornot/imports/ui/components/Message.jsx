import React from 'react';

const Message = ({ msg, author }) => (
  <div className="wrapper-message">
    {author ? <div className="message-author">{author}: </div> : null}
    {msg ? <div className="message-message">{msg}</div> : null}
  </div>
);

Message.propTypes = {
  msg: React.PropTypes.string,
  author: React.PropTypes.string,
};

export default Message;
