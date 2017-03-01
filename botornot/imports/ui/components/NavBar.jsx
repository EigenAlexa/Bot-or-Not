import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Meteor } from 'meteor/meteor';

class NavBar extends React.Component {
  constructor(params) {
    super(params);
    this.state = {width: 0, height:0};
    this.updateDimensions = this.updateDimensions.bind(this); 
  }
  user() {
    return Meteor.user();
  }
  navLinks() {
    if (!Meteor.loggingIn() && Meteor.user()) {
      console.log(this.user());
      const username = this.user().username;
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/">Home</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/leaderboards">Leaderboards</a></li>
          <li><a href={"/profile/" + username}>{username}</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul> 
      );
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/">Home</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/leaderboards">Leaderboards</a></li>
          <li><a href="/sign-in">Sign In</a></li>
          <li><a href="/sign-up">Sign Up</a></li>
        </ul> 
      );
    }
  }
  updateDimensions() {
    this.setState({width: $(window).width(), height: $(window).height()});
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  render() {
    let logo;

    if (this.state.width >= 768 && this.state.width < 900) {
      logo = "img/logo_icon.png"
    } else {
      logo = "img/logo.png"
    }
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          {/* Brand and toggle get grouped for better mobile display */}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-left" href="/" title="HOME"><i className="none" />
              <img src={logo} alt="Brand" className="img-response"/>
            </a>
          </div> {/* /.navbar-header */}
          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {this.navLinks()}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container */}
      </nav>
    );
  }
}

export default NavBar;
