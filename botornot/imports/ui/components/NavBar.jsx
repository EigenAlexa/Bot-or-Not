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
  navLinks(classes) {
    if (!Meteor.loggingIn() && Meteor.user()) {
      const username = this.user().username;
      return (
        <ul className={classes}>
          <li><a href="/">Home</a></li>
          <li><a href="/chat">Chat</a></li>
          <li><a href="/leaderboards">Leaderboards</a></li>
          <li><a href={"/profile/" + username}>Profile</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul> 
      );
    } else {
      return (
        <ul className={classes}>
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
    routeName = FlowRouter.current().route.name;

    let navbar_class = "navstyle-";
    let home_screen_align = ""
    if(routeName == "home") {
      navbar_class += "home";
      home_screen_align="navbar-right";
    }
    else {
      navbar_class += "default";
      home_screen_align="navbar-right";
      // home_screen_align="nav-align";
    }

    return (
    <div className={navbar_class}>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
            {/* Brand and toggle get grouped for better mobile display */}
            <div className="navbar-default">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="/" title="HOME"><i className="none" />
                Bot <span>or Not</span>
              </a>
            </div> {/* /.navbar-header */}
          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {this.navLinks("nav navbar-nav " + home_screen_align)}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container */}
      </nav>
    </div> 
    );
  }
}

export default NavBar;
