import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import LeaderboardEntry from '/imports/ui/components/LeaderboardEntry.jsx';

export default class LeaderboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rank: 0}
  }
  componentDidMount() {
    Meteor.call('users.getUserRanking', Meteor.userId(), (error, result) => {
      if (!error){
        this.setState({'rank': result});
      } else {
        console.log(error);
      }
    });
  }  
  render() {
    LeaderboardEntries = this.props.users.map((user, index) => ( 
      <LeaderboardEntry 
      key={user._id} 
      user={user}
      number={index +1 } />  
    ));
    return (
      <div className="leaderboard">
        <title>Bot or Not</title>

        <h2 className="page-header">
          Leaderboard
        </h2>

        <div className="">
          <div className="leader-info">
            <h1 className="leader-username">Username: <a href={"/profile/" + this.props.currentUser.username}>{this.props.currentUser.username}</a></h1>
            <h2 className="leader-ranking">Rank: #{this.state.rank}</h2>
          </div>
          <div className="leaderboardentries">
            <table>
            <thead>
            <tr className="row">
            <td className="col-md-1 leader-elem"></td>
              <td className="col-md-1 leader-elem">Username</td>
              <td className="col-md-1 leader-elem leader-rating">Rating</td>
            </tr>
            </thead>
            <tbody>
              {LeaderboardEntries}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

LeaderboardPage.propTypes = {
  users: React.PropTypes.array,
  currentUser: React.PropTypes.object
}
