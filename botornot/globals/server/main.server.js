import { Meteor } from 'meteor/meteor';
import '/imports/collections/messages/messages.collection.js';
import HomeScreen from '/imports/ui/screens/home.screen.jsx';
import messages from '/imports/collections/messages/messages.collection.js';
import users from '/imports/collections/users/users.collection.js';
import UserSchema from '/imports/collections/users/users.collection.js';

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

// if we don't want to send a cursor, write this.ready() instead.

Meteor.methods({
    'users.makeNew'({name, pass}) {
    console.log(users.find().fetch());	
    const sameuser = users.find({username: name}).fetch();

    if (sameuser.length > 0) {
      console.log("username already taken");
      return;
    }

    users.insert({username: name, password: pass});
  }
});