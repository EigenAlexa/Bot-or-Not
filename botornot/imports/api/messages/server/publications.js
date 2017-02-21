import { Messages } from '../messages.js';

Meteor.publish('msgs', (convoId) => {
  return Messages.find({convoId: convoId});

});
