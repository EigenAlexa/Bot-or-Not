import { Convos } from './convos.js';
import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages/messages.js';

Convos.addLinks({
    messages: {
        type: 'many',
        collection: Messages,
        field: 'messageId', // optional, it generates a unique one
     //   metadata: {}, // optional, use it for meta relationships
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
    },
    users: {
        type: 'many',
        collection: Meteor.users,
        field: 'userId', // optional, it generates a unique one
        // metadata: {}, // optional, use it for meta relationships
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
    }
});
