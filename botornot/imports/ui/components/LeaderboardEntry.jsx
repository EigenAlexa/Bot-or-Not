import React, { Component, PropTypes } from 'react';

export default class LeaderboardEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'ranking': false};
  }
  getContent() {
    console.log(this.props.user);
    return {
      username: this.props.user.username, 
      rating: this.props.user.rating,
      number: this.props.number,
      id: this.props.user._id,
      level: this.props.user.level
    }
  }
  render() {
    content = this.getContent();
    console.log(content);
    if (!this.state.ranking) {
      Meteor.call('users.getUserRanking', content.id, (error, result) => {
        this.setState({'ranking': result});
      });
    }
    return (
        <tr className="row">
          <td className="col-md-1 leader-elem">{this.state.ranking ? this.state.ranking : ""}</td>
          <td className="col-md-1 leader-elem"><a href={"/profile/" + content.username}>{content.username}</a></td>
          <td className="col-md-1 leader-elem leader-rating">{content.level}</td>
          <td className="col-md-1 leader-elem leader-rating">{content.rating.toFixed(2)}</td>
        </tr>
    );

  }
}

LeaderboardEntry.propTypes = {
  user: React.PropTypes.object.isRequired
};
