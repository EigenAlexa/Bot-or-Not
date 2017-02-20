import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactLayout} from 'meteor/kadira:react-layout';

import React from 'react';
import {mount} from 'react-mounter';

import Screen from '/imports/ui/layouts/screen.jsx'


import HomePage from '/imports/ui/pages/HomePage.jsx';
import ContactPage from '/imports/ui/pages/ContactPage.jsx';
import LeaderboardContainer from '/imports/ui/containers/LeaderboardPageContainer.jsx';
import PrivacyPage from '/imports/ui/pages/PrivacyPage.jsx';
import ChatPage from '/imports/ui/pages/ChatPage.jsx';
import WaitPage from '/imports/ui/pages/WaitPage.jsx';
import WaitPageContainer from '/imports/ui/containers/WaitPageContainer.jsx';
//import SignInPage from '/imports/ui/pages/SignInPage.jsx';
import { Session } from 'meteor/session';
import { getARoom } from '/imports/startup/client/methods.js';

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
		ReactLayout.render(Screen, {children: <LeaderboardContainer /> });
	}
});
FlowRouter.route('/wait', {
	name: 'wait',
	action() {
		//sessionUpdate("/wait");
		ReactLayout.render(Screen, {children:<WaitPageContainer />});
	}
});
/*FlowRouter.route('/signin', {
  name: 'signin',
  action() {
    sessionUpdate('/signin');
    ReactLayout.render(Screen, {children: <SignInPage />});
  }
}); 
*/
function whosHere(){

}

function sessionUpdate(s) {
    // Updates the current session tracker to include the users location
	Session.set("location", s);
	console.log(Session["keys"]["location"]);
	Meteor.call("updateSessionDict", Session);
}
