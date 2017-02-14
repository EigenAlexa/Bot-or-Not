import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Chat from '/imports/collections/messages/ui/Chat.jsx';
import Messages from '/imports/collections/messages/messages.collection.js';
import HomeScreen from '/imports/ui/screens/home.screen.jsx';
import HomePage from '/globals/client/index.jsx';
import LeaderboardPage from '/globals/client/leaderboard.jsx';
import '/imports/ui/routes.js';


Meteor.startup(function() {
	FlowRouter.initialize();
});

Meteor.subscribe("leaderboard");
Meteor.subscribe("conversations");



// need to get autoform running
// need to be able to load layouts onto screenmanager without window exception
