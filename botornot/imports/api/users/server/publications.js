import { Convos } from '/imports/api/convos/convos.js';

Meteor.publish('topNUsers', (N) => {
  return Meteor.users.find({}, {
    sort: {rating: -1},
    limit: N,
    fields: {username: 1, rating: 1}
  });
});

Meteor.publish('currentUsers', (convoId) => {
  convo = Convos.findOne({_id: convoId});
  return Meteor.users.find({_id: {$in: convo.users}}, {
    fields: {username: 1}
  });
});

Meteor.publish('currentUser', (userId) => {
  return Meteor.users.find({_id: userId}, 
      {fields: {username: 1, in_convo: 1, curConvo: 1}});
});
