import { Meteor } from 'meteor/meteor';
import '/imports/collections/messages/messages.collection.js';
import HomeScreen from '/imports/ui/screens/home.screen.jsx';
import messages from '/imports/collections/messages/messages.collection.js';
import users from '/imports/collections/users/users.collection.js';

Meteor.publish("messages", function (convoId) {
  return messages.find({idNumber : convoId});
  // this is a cursor -> use fetch, map, forEach, etc.
});

Meteor.publish("leaderboard", function () {
	return users.find({}, {sort: {notratings: -1}, limit: 25});
	// with this cursor, use .forEach(function (user) {});
});

Meteor.publish("rank", function (name) {
	return users.find({username : name});
	// need to find quick way to determine rank.
});