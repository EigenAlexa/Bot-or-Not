import React from 'react';

export const ConvoItem = ({ convo, time }) => (
  <div className="wrapper-message">
    {time.toString()}
  </div>
);

ConvoItem.propTypes = {
    convo: React.PropTypes.object,
    time: React.PropTypes.object,
};

