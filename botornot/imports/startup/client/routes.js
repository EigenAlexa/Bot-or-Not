import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactLayout} from 'meteor/kadira:react-layout';
import { Session } from 'meteor/session';

import React from 'react';
import {mount} from 'react-mounter';

import Screen from '/imports/ui/layouts/screen.jsx'
import HomePage from '/imports/ui/screens/index.jsx';
import ContactPage from '/imports/ui/screens/contact.jsx';
import LeaderboardPage from '/imports/ui/screens/leaderboard.jsx';
import PrivacyPage from '/imports/ui/screens/privacy.jsx';
import WaitPageContainer from '/imports/ui/containers/WaitPageContainer.jsx';


FlowRouter.wait();

FlowRouter.route('/', {
  name: 'home',
  action() {
  		//sessionUpdate("/");
  		ReactLayout.render(Screen, {children: <HomePage /> });
  }
});
FlowRouter.route('/contact', {
	name: 'contact',
	action() {
		//sessionUpdate("/contact");
		ReactLayout.render(Screen, {children: <ContactPage /> });
	}
});
FlowRouter.route('/privacy', {
	name: 'privacy',
	action() {
		//sessionUpdate("/privacy");
		ReactLayout.render(Screen, {children: <PrivacyPage /> });
	}
});
FlowRouter.route('/leaderboards', {
	name: 'leaderboard',
	action() {
		//sessionUpdate("/leaderboards");
		ReactLayout.render(Screen, {children: <LeaderboardPage /> });
	}
});
FlowRouter.route('/wait', {
	name: 'wait',
	action() {
		//sessionUpdate("/wait");
		ReactLayout.render(Screen, {children:<WaitPageContainer />});
	}
});

function whosHere(){

}

function sessionUpdate(s) {
    // Updates the current session tracker to include the users location
	Session.set("location", s);
	console.log(Session["keys"]["location"]);
	Meteor.call("updateSessionDict", Session);
}
