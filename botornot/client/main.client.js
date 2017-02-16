import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js'

import '/imports/startup/client/routes.js';


Meteor.startup(function() {
	FlowRouter.initialize();
});

// const leaderboard = Meteor.subscribe("leaderboard");
// const conversations = Meteor.subscribe("conversations");
// const availableUsers = Meteor.subscribe("availableUsers");

const collectionsToSeed = [Convos, Messages];

seedCollections(collectionsToSeed, {
  numItemsPerCollection : 15,
});

console.log(Convos.find().fetch());
console.log(Messages.find().fetch());

