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
      <div>
        <title>Bot or Not</title>
        
        <section className="section-background">
          <div className="container">
            <h2 className="page-header">
              Leaderboard
            </h2>
          </div> {/* /.container */}
        </section> {/* /.section-background */}
        <div className="container">
          <div className="row"><h1>{this.state.rank}</h1></div>
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
  users: React.PropTypes.array
}
