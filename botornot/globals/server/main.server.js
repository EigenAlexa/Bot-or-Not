import { Meteor } from 'meteor/meteor';

import HomeScreen from '/imports/ui/screens/home.screen.jsx';
import { Messages, Convos } from '/imports/collections/messages/messages.collection.js';

// import { Template } from 'meteor/templating';
// import './index.html'

// Template.body.helpers({
//     conversations() {
//         return Convos.find();
//     },
// });
Meteor.publish("conversations", function () {
  return Convos.find();
  // this is a cursor -> use fetch, map, forEach, etc.
});

Meteor.publish("leaderboard", function () {
    return "";
	// return users.find({}, {sort: {notratings: -1}, limit: 25});
	// with this cursor, use .forEach(function (user) {});
});

Meteor.publish("rank", function (name) {
	return Meteor.users.find({emails: name}); // TODO fix this for somethign better
    // users.find({username : name});
	// need to find quick way to determine rank.
});
