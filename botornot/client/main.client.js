import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '/imports/startup/both';
import '/imports/startup/client';


Meteor.startup(function() {
	FlowRouter.initialize();
});

// const leaderboard = Meteor.subscribe("leaderboard");
// const conversations = Meteor.subscribe("conversations");
// const availableUsers = Meteor.subscribe("availableUsers");


