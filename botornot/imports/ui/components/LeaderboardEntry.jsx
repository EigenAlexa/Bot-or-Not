import React, { Component, PropTypes } from 'react';

export default class LeaderboardEntry extends React.Component {
  getContent() {
    console.log(this.props.user);
    return {
      username: this.props.user.username, 
      rating: this.props.user.rating
    }
  }
  render() {
    content = this.getContent();
    console.log(content);
    return (
        <tr>
          <td>{content.username}</td>
          <td>{content.rating}</td>
        </tr>
    );

  }
}

LeaderboardEntry.propTypes = {
  user: React.PropTypes.object.isRequired
};
