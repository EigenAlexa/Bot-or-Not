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
import WaitPageContainer from '/imports/ui/containers/WaitPageContainer.jsx';
import ProfileContainer from '/imports/ui/containers/ProfilePageContainer.jsx';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';
import { getARoom } from '/imports/startup/client/methods.js';
import { updateCookiesOnExit } from '/imports/startup/client/config.js';
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
FlowRouter.route('/chat', {
	name: 'chat',
	action() {
    ReactLayout.render(Screen, {children:<WaitPageContainer />});
	},
  triggersExit: (context) => {
    console.log('exited chat');
    Meteor.call('users.exitConvo', Meteor.userId());
    updateCookiesOnExit();
  }
});

FlowRouter.route('/profile/:username', {
	name: 'profile',
	action(params, queryParams) {
		ReactLayout.render(Screen, {children:<ProfilePageContainer params={{ params: params}} />});
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
/*
FlowRouter.route("/closed", {
  name: "closed",
  action(params, queryParams){
    console.log("Chat closed");
    console.log(params, queryParams);
    ReactLayout.render(Screen, {children: <ClosedPageContainer params={{roomId: queryParams.convoId, userLeft: queryParams.userLeft}}/> }); 
  }

});
*/

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
