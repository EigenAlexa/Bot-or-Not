import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactLayout} from 'meteor/kadira:react-layout';
//import {Layout} from '/imports/ui/layout/layout'
import {mount} from 'react-mounter';
import Screen from '/imports/ui/layouts/screen.jsx'
import HomePage from '/imports/ui/screens/index.jsx';
import ContactPage from '/imports/ui/screens/contact.jsx';
import LeaderboardPage from '/imports/ui/screens/leaderboard.jsx';
import PrivacyPage from '/imports/ui/screens/privacy.jsx';
import ChatPage from '/imports/ui/screens/chat.jsx';
import WaitPage from '/imports/ui/screens/wait.jsx';
import ChatContainer from '/imports/ui/containers/ChatContainer.jsx';
import { Session } from 'meteor/session';
import { getARoom } from '/imports/startup/client/methods.js';
FlowRouter.wait();

FlowRouter.route('/index', {
  name: 'home',
  action() {
  		sessionUpdate("/index");
  		ReactLayout.render(Screen, {children: <HomePage /> });
  }
}); 
FlowRouter.route('/contact', {
	name: 'contact',
	action() {
		sessionUpdate("/contact");
		ReactLayout.render(Screen, {children: <ContactPage /> });
	}
});
FlowRouter.route('/privacy', {
	name: 'privacy',
	action() {
		sessionUpdate("/privacy");
		ReactLayout.render(Screen, {children: <PrivacyPage /> });
	}
});
FlowRouter.route('/chat', {
	name: 'chatroom',
	action() {
		sessionUpdate("/chat");
		ReactLayout.render(Screen, {children: <ChatPage /> });
	}
});
FlowRouter.route('/leaderboards', {
	name: 'leaderboard',
	action() {
		sessionUpdate("/leaderboards");
		ReactLayout.render(Screen, {children: <LeaderboardPage /> });
	}
});
FlowRouter.route('/wait', {
	name: 'wait',
	action() {
		sessionUpdate("/wait");
		whosHere();
        let roomId = getARoom();
		ReactLayout.render(Screen, {children:<ChatContainer params={{id: roomId}}/>});
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






