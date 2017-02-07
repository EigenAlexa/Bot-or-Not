import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';
 
import Chat from '/imports/collections/messages/ui/Chat.jsx';
import Messages from '/imports/collections/messages/messages.collection.js';
import HomeScreen from '/imports/ui/screens/home.screen.jsx';
import HomePage from '/imports/ui/screens/index.jsx';
import LeaderboardPage from '/imports/ui/screens/leaderboard.jsx';
import '/imports/ui/routes.js';

 
Meteor.startup(function() {
	FlowRouter.initialize(),
	render(
		<LeaderboardPage />,
  		document.getElementById('screencomponent'));
});

function makeNewUser() {
	const name = window.prompt("What's your name");
	const pass = window.prompt("how about a password");
	users.insert({username: name, password: pass});
}

// need to get autoform running
// need to be able to load layouts onto screenmanager without window exception 
