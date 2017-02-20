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
              Leaderboards
            </h2>
          </div> {/* /.container */}
        </section> {/* /.section-background */}
      <table>    
        {LeaderboardEntries}
      </table>
      </div>
    );
  }
}

LeaderboardPage.propTypes = {
  users: React.PropTypes.array
}
