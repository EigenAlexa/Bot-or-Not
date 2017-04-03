import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
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
    let navLinks = [
      ['/', 'Home'],
      ['/chat', 'Chat'],
      ['/leaderboards', 'Leaderboards'],
    ];
    if (this.props.userLoggedIn && this.props.notAnon) {
      const username = this.user().username;
      navLinks.push(['/profile/' + username, 'Profile']);
      navLinks.push(['/logout', 'Logout']);
    } else if (this.props.userLoggedIn && !this.props.notAnon) {
      navLinks.push(['/sign-in-anon', 'Sign In']);
      navLinks.push(['/sign-up', 'Sign Up']);
    } else {
      navLinks.push(['/sign-in', 'Sign In']);
      navLinks.push(['/sign-up', 'Sign Up']);
    }
    NavLinks = navLinks.map((item) => {
      return (<li key={item[0]}><a href={item[0]} data-toggle="collapse" data-target=".navbar-collapse.in">{item[1]}</a></li>)
    });
    return (
    <ul className={classes}>
      {NavLinks}
    </ul> );
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
  getActiveUsers() {
		users = UserConnections.find().count()
    console.log('active users', users)
    return users;
  }
  renderActiveUsers() {
    return  <div className='active-user-div'>Users Online: <span>{this.props.usersOnline}</span></div> ;
  }
  // onBlurEvent() {
  //   console.log('onBlur');
  //    ReactDOM.findDOMNode(this.refs.collapseDiv).collapse('hide');
  // }
  render() {
    routeName = FlowRouter.current().route.name;

    let navbar_class = "navstyle-";
    let home_screen_align = ""
    if(this.props.isHome) {
      navbar_class += "home";
      home_screen_align="navbar-right";
    }
    else {
      navbar_class += "default";
      home_screen_align="navbar-right";
      // home_screen_align="nav-align";
    }

    const displayActiveUsers= this.props.usersOnline >= 10;
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
          <div ref='collapseDiv' className="collapse navbar-collapse" id="bs-example-navbar-collapse-1" >
            {this.navLinks("nav navbar-nav " + home_screen_align)}
            {displayActiveUsers ? this.renderActiveUsers(): ""}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container */}
      </nav>
    </div> 
    );
  }
}

const NavBarContainer = createContainer(() => {
	const usersHandle = Meteor.subscribe('userStatus');
	const loadingUserCount = !usersHandle.ready();
	const usersOnline = loadingUserCount ? 0 : Meteor.users.find({'status.online': true}).count();
  const routeName = FlowRouter.getRouteName();
  const lastRoute = Session.get('lastRoute');
  const isHome = routeName === 'home' || (routeName === 'logout' && lastRoute === 'home');
  const userLoggedIn = !Meteor.loggingIn() && Meteor.user();
  const notAnon = Meteor.user() && !Meteor.user().anon;
	return {
		loadingUserCount,
		usersOnline,
    isHome,
    userLoggedIn,
    notAnon,
	}	
}, NavBar);
export default NavBarContainer;
