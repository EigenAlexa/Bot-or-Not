import React from 'react';

const Message = ({ msg, msgClass }) => (
  <div className="wrapper-message">
    {msg ? <div className={msgClass}>{msg}</div> : null}
  </div>
);

Message.propTypes = {
  msg: React.PropTypes.string,
  msgClass: React.PropTypes.string,
};

export default Message;
