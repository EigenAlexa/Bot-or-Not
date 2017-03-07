import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import LeaderboardEntry from '/imports/ui/components/LeaderboardEntry.jsx';

export default class LeaderboardPage extends React.Component {
    
  render() {
    LeaderboardEntries = this.props.users.map(user => ( 
      <LeaderboardEntry 
      key={user._id} 
      user={user} />  
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
          <div className="leaderboardentries">
            <table>
            <thead>
            <tr className="row">
              <td className="col-md-1">Username</td>
              <td className="col-md-1">Rating</td>
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
