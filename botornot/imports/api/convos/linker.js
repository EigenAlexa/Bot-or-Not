import { Convos } from './convos.js';
import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages/messages.js';
import { Ratings } from '../ratings/ratings.js';

Convos.addLinks({
    messages: {
        type: 'many',
        collection: Messages,
        field: 'messageId', // optional, it generates a unique one
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
    },
    users: {
        type: 'many',
        collection: Meteor.users,
        field: 'userId', // optional, it generates a unique one
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
    },
    ratings : {
        type: 'many',
        collection: Ratings,
        field: 'ratingId',
        autoremove: false,
    }
});

Convos.expose({
});
Messages.expose();
