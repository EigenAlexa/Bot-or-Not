import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactLayout } from 'meteor/kadira:react-layout';
import { mount } from 'react-mounter';
import { Session } from 'meteor/session';


import { updateCookiesOnExit } from '/imports/startup/client/config.js';

// Containers, Pages, and Components
import Screen from '/imports/ui/layouts/screen.jsx'
import HomePage from '/imports/ui/pages/HomePage.jsx';
import ContactPage from '/imports/ui/pages/ContactPage.jsx';
import LeaderboardContainer from '/imports/ui/containers/LeaderboardPageContainer.jsx';
import PrivacyPage from '/imports/ui/pages/PrivacyPage.jsx';
import WaitPageContainer from '/imports/ui/containers/WaitPageContainer.jsx';
import { ProfilePageContainer } from '/imports/ui/containers/ProfileContainer.jsx';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';
import BugReport from '/imports/ui/components/BugReport.jsx';
import FourOhFourPage from '/imports/ui/pages/404Page.jsx';


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
    ReactLayout.render(Screen, {children:<WaitPageContainer />, customFooter: true});
	},
  triggersExit: (context) => {
    Meteor.call('users.exitConvo');
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
FlowRouter.route("/sign-up-anon", {
  name: "sign-up-anon",
  action() {
    FlowRouter.redirect('/change-password');
  }
});
/*
FlowRouter.route("/closed", {
  name: "closed",
  action(params, queryParams){
    ReactLayout.render(Screen, {children: <ClosedPageContainer params={{roomId: queryParams.convoId, userLeft: queryParams.userLeft}}/> }); 
  }

});
*/
FlowRouter.triggers.exit(context => {
  Session.set('lastRoute', context.route.name);
});
FlowRouter.notFound = {
  action: () => {
		ReactLayout.render(Screen, {children:<FourOhFourPage/>});
  }
};  

// UserAccounts Routes
AccountsTemplates.configure({
  defaultLayoutType: 'blaze-to-react',
  defaultTemplate: 'customSignIn',  // default
  defaultLayout: Screen,
  defaultLayoutRegions: {},
  defaultContentRegion: 'children',
});
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

function sessionUpdate(s) {
    // Updates the current session tracker to include the users location
	Session.set("location", s);
	Meteor.call("updateSessionDict", Session);
}
