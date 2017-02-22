import { Convos } from '/imports/api/convos/convos.js';

Meteor.publish('topNUsers', (N) => {
  return Meteor.users.find({}, {
    sort: {rating: -1},
    limit: N,
    fields: {username: 1, rating: 1}
  });
});

Meteor.publishComposite('currentUsers', (convoId) => {
  //convo = Convos.findOne({users: {$in: [userId]}});
  return {
    find() {
      return Convos.find({_id: convoId});
    },
    children: [{ 
      find(convo) {
        return Meteor.users.find({_id: {$in: convo.users}}, {
          fields: {username: 1, in_convo: 1, curConvo:1}                
        });
      }
    }]
  };
});

Meteor.publish('currentUser', (userId) => {
  user = Meteor.users.find({_id: userId}, 
      {fields: {username: 1, in_convo: 1, curConvo: 1, left: 1}});
  session = Meteor.server.sessions[Object.keys(Meteor.server.sessions).filter((key) => {
    return Meteor.server.sessions[key].userId == userId;  
  })];
  session.socket.on('close', Meteor.bindEnvironment(() => {
    console.log(userId, " left");
    query = {closed: false, users: {$in: [userId]}};
    convo = Convos.findOne(query);
    Meteor.call('convos.finishConvo', convo._id);
    Meteor.call('convos.finishConvoUserLeft', convo._id);
  }));
  return user;
});
