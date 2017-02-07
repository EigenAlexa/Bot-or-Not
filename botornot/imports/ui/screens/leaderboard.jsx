import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

var LeaderboardPage = React.createClass({
  render: function() {
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
        <ul className="social-icon">
          <li><a href="#"><i className="ion-social-twitter" /></a></li>
          <li><a href="#"><i className="ion-social-facebook" /></a></li>
          <li><a href="#"><i className="ion-social-linkedin-outline" /></a></li>
          <li><a href="#"><i className="ion-social-googleplus" /></a></li>
        </ul> {/* /.subscribe */}
        {/* deleted end div */}
      </div>
    );
  }
});

export default LeaderboardPage;