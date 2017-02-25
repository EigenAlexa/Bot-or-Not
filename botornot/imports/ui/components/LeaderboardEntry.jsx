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
        <tr className="row">
          <td className="col-md-1"><a href={"/profile/" + content.username}>{content.username}</a></td>
          <td className="col-md-1">{content.rating}</td>
        </tr>
    );

  }
}

LeaderboardEntry.propTypes = {
  user: React.PropTypes.object.isRequired
};
