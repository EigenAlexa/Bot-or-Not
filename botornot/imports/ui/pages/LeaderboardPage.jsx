import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import LeaderboardEntry from '/imports/ui/components/LeaderboardEntry.jsx';

export default class LeaderboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rank: 0}
  }
  componentDidMount() {
    if(Meteor.user()){
      Meteor.call('users.getUserRanking', Meteor.user().username, (error, result) => {
        if (!error){
          this.setState({'rank': result});
        }
      });
    }
  }  
  render() {
    LeaderboardEntries = this.props.users.map((user, index) => ( 
      <LeaderboardEntry 
      key={user.username} 
      user={user}
      number={index +1 } />  
    ));
    return (
      <div className="container">
      <div className="col-xs-12 col-sm-offset-1 col-sm-10">
        <title>Bot or Not</title>
        <h2 className="page-header">
          Leaderboard
        </h2> 

        <div className="">
          {!!this.props.currentUser ? (
          <div className="leader-info">
            <h1 className="leader-username">Username: <a href={"/profile/" + this.props.currentUser.username}>{this.props.currentUser.username}</a></h1>
            {!!this.state.rank ? <h2 className="leader-username">Rank: #{this.state.rank}</h2> : "" }
          </div>)
          : "" }
          <div className="leaderboardentries">
            <table>
            <thead>
            <tr className="row">
            <td className="col-md-1 leader-elem"></td>
              <td className="col-md-1 leader-elem  leader-header">Username</td>
              <td className="col-md-1 leader-elem  leader-header">Level</td>
              <td className="col-md-1 leader-elem leader-header">Rating</td>
            </tr>
            </thead>
            <tbody>
              {LeaderboardEntries}
            </tbody>
            </table>
          </div>
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
