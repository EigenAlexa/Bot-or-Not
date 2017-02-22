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
      {fields: {username: 1, in_convo: 1, curConvo: 1}});
/**  session = Meteor.server.sessions[Object.keys(Meteor.server.sessions).filter((key) => {
    return Meteor.server.sessions[key].userId == userId;  
  })];
  session.socket.on('close', Meteor.bindEnvironment(() => {
    console.log(userId, " left");
    Meteor.users.update({_id: userId}, {
      $set: {in_convo: false}
    });
    query = {closed: false, users: {$in: [userId]}};
    convo = Convos.findOne(query);
    users = convo.users.filter((user) => {return user !== userId});
    console.log(users);
    Convos.update(query, {
      $set: {curSessions: 0, closed: true}
    });
    Meteor.users.update({_id: {$in: users}}, {
      $set: {in_convo: false}
    });
  }));
  user.observe({
    changed: (newUser, oldUser) => {
      if(!newUser.in_convo && oldUser.in_convo){
        console.log("callback for user: " + newUser._id);
        FlowRouter.go('/closed?convoId=' + oldUser.curConvo);
      }
    },

  }); **/
  return user;
});
