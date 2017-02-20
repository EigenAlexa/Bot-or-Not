import React, { Component, PropTypes } from 'react';

export default class LeaderboardEntry extends React.Component {
  getContent() {
    return {
      username: this.props.user.username, 
      rating: this.props.user.profile.rating
    }
  }
  render() {
    content = this.getContent();
    return (
        <tr>
          <td>content.username</td>
          <td>content.rating</td>
        </tr>
    );

  }
}

LeaderboardEntry.propTypes = {
  user: React.PropTypes.object.isRequired
};
