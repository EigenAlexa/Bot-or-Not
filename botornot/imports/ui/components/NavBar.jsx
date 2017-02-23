import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Meteor } from 'meteor/meteor';

var NavBar = React.createClass({
  user() {
    return Meteor.user();
  },
  navLinks() {
    if (!Meteor.loggingIn() && Meteor.user()) {
      console.log(this.user());
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/">Home</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/leaderboards">Leaderboards</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/profile">{this.user().username}</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul> 
      );
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/">Home</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/leaderboards">Leaderboards</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/sign-in">Sign In</a></li>
          <li><a href="/sign-up">Sign Up</a></li>
        </ul> 
      );
    }
  },
  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          {/* Brand and toggle get grouped for better mobile display */}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="/" title="HOME"><i className="none" /> Bot <span>or Not</span></a>
          </div> {/* /.navbar-header */}
          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {this.navLinks()}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container */}
      </nav>
    );
  }
});

export default NavBar;
