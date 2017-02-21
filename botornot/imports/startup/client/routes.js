import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactLayout } from 'meteor/kadira:react-layout';
import { mount } from 'react-mounter';
import { Session } from 'meteor/session';


import Screen from '/imports/ui/layouts/screen.jsx'


import HomePage from '/imports/ui/pages/HomePage.jsx';
import ContactPage from '/imports/ui/pages/ContactPage.jsx';
import LeaderboardContainer from '/imports/ui/containers/LeaderboardPageContainer.jsx';
import PrivacyPage from '/imports/ui/pages/PrivacyPage.jsx';
import AccountsPage from '/imports/ui/pages/AccountsPage.jsx';
import WaitPageContainer from '/imports/ui/containers/WaitPageContainer.jsx';


//import SignInPage from '/imports/ui/pages/SignInPage.jsx';
import { getARoom } from '/imports/startup/client/methods.js';

FlowRouter.wait();

FlowRouter.route('/', {
  name: 'home',
  action() {
  		ReactLayout.render(Screen, {children: <HomePage /> });
  }
});
FlowRouter.route('/contact', {
	name: 'contact',
	action() {
		ReactLayout.render(Screen, {children: <ContactPage /> });
	}
});
FlowRouter.route('/privacy', {
	name: 'privacy',
	action() {
		ReactLayout.render(Screen, {children: <PrivacyPage /> });
	}
});

FlowRouter.route('/leaderboards', {
	name: 'leaderboard',
	action() {
		ReactLayout.render(Screen, {children: <LeaderboardContainer /> });
	}
});
FlowRouter.route('/wait', {
	name: 'wait',
	action() {
		ReactLayout.render(Screen, {children:<WaitPageContainer />});
	}
});


FlowRouter.route("/logout", {
  name: "logout",
  action() {
    Meteor.logout(() => {
      FlowRouter.redirect("/");
    });
  }
});


// UserAccounts Routes
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

function sessionUpdate(s) {
    // Updates the current session tracker to include the users location
	Session.set("location", s);
	console.log(Session["keys"]["location"]);
	Meteor.call("updateSessionDict", Session);
}
