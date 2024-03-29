import React, { Component, PropTypes } from 'react';

export default class LeaderboardEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'ranking': false};
  }
  getContent() {
    return {
      username: this.props.user.username, 
      rating: this.props.user.rating,
      number: this.props.number,
      level: this.props.user.level
    }
  }
  componentWillMount() {
    if (!this.state.ranking) {
      Meteor.call('users.getUserRanking', this.props.user.username,  (error, result) => {
        this.setState({'ranking': result});
      });
    }
  }
  render() {
    content = this.getContent();
    if (content.rating != 0){    
      return (
          <tr className="row">
            <td className="col-md-1 leader-elem">{this.state.ranking ? this.state.ranking : ""}</td>
            <td className="col-md-1 leader-elem"><a href={"/profile/" + content.username}>{content.username}</a></td>
            <td className="col-md-1 leader-elem leader-rating">{content.level}</td>
            <td className="col-md-1 leader-elem leader-rating">{content.rating.toFixed(2)}</td>
          </tr>
      );
    } else {
      return (null);
    }

  }
}

LeaderboardEntry.propTypes = {
  user: React.PropTypes.object.isRequired
};
