import React from 'react';

export const ConvoItem = ({ convo, time }) => {
  date = moment(time);
  console.log(date);
  return <div className="wrapper-message">
    {date.format('MMMM Do YYYY, h:mm:ss a')}
  </div>
};

ConvoItem.propTypes = {
    convo: React.PropTypes.object,
    time: React.PropTypes.object,
};

