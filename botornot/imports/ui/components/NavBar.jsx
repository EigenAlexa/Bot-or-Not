import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

var NavBar = React.createClass({
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
            <a className="navbar-brand" href="index" title="HOME"><i className="none" /> Bot <span>or Not</span></a>
          </div> {/* /.navbar-header */}
          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className="active"><a href="index">Home</a></li>
              {/* TODO make the navbar into it's own tempalte */}
              <li><a href="chat">Chat</a></li>
              <li><a href="leaderboards">Leaderboards</a></li>
              <li><a href="privacy">Privacy</a></li>
              <li><a href="contact">Contact</a></li>
              <li><a href="signin">Sign In</a></li>
              <li><Blaze template="loginButtons" /></li>
            </ul> {/* /.nav */}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container */}
      </nav>
    );
  }
});

export default NavBar;
