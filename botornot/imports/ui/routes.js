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
import NavBar from '/imports/ui/screens/navbar.jsx';
import WaitPage from '/imports/ui/screens/wait.jsx';
import { Session } from 'meteor/session';
FlowRouter.wait();

FlowRouter.route('/index', {
  name: 'home',
  action() {
  		sessionUpdate("/index");
  		ReactLayout.render(Screen, {children: <div> <NavBar /> <HomePage /> </div>});
  }
}); 
FlowRouter.route('/contact', {
	name: 'contact',
	action() {
		sessionUpdate("/contact");
		ReactLayout.render(Screen, {children: <div> <NavBar /> <ContactPage /> </div>});
	}
});
FlowRouter.route('/privacy', {
	name: 'privacy',
	action() {
		sessionUpdate("/privacy");
		ReactLayout.render(Screen, {children: <div> <NavBar /> <PrivacyPage /> </div>});
	}
});
FlowRouter.route('/chat', {
	name: 'chatroom',
	action() {
		sessionUpdate("/chat");
		ReactLayout.render(Screen, {children: <div> <NavBar /> <ChatPage /> </div>});
	}
});
FlowRouter.route('/leaderboards', {
	name: 'leaderboard',
	action() {
		sessionUpdate("/leaderboards");
		ReactLayout.render(Screen, {children: <div> <NavBar /> <LeaderboardPage /> </div>});
	}
});
FlowRouter.route('/wait', {
	name: 'wait',
	action() {
		sessionUpdate("/wait");
		whosHere();
		ReactLayout.render(Screen, {children: <div> <NavBar /> <WaitPage /> </div>});
	}
});

function whosHere(){
	
}

function sessionUpdate(s) {
	if (Session["keys"]["num"] == null) {
		Session.set("num", Math.random(100));
		console.log(Session.get("num"));
	}
	Session.set("location", s);
	console.log(Session["keys"]["location"]);
	Meteor.call("updateSessionDict", Session);	
}






