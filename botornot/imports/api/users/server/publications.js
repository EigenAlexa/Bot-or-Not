import { Convos } from '/imports/api/convos/convos.js';
import { exitConvo } from '/imports/api/users/methods.js';

Meteor.publish('topNUsers', (N) => {
  return Meteor.users.find({}, {
    sort: {rating: -1},
    limit: N,
    fields: {username: 1, rating: 1, level:1}
  });
});
Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true }, { fields: { "status.online" : 1, anon: 1 } });
});
Meteor.publish('users.ratings', () => {
	return UserStatus.connections.find();
    // return Meteor.users.find({}, { fields :{ rating : 1} });
});

Meteor.publishComposite('currentUsers', (convoId) => {
  //convo = Convos.findOne({users: {$in: [userId]}});
  return {
    find() {
      return Convos.find({_id: convoId});
    },
    children: [{ 
      find(convo) {
        users = convo.users.map((user) => (user.id));
        return Meteor.users.find({_id: {$in: users}}, {
          fields: {username: 1, in_convo: 1, curConvo:1, convoClosed: 1, isReady: 1, lastOtherUser: 1, level:1}                
        });
      }
    }]
  };
});

Meteor.publish('currentUser', () => {
  userId = Meteor.userId();
  if(!userId){
    console.log(this.userId);
    console.log(userId);
    console.log("Meteor.subscribe('currentUser') -- no userId found for user");
    return [];
  }
  user = Meteor.users.find({_id: userId}, 
      {fields: {username: 1, in_convo: 1, curConvo: 1, left: 1, convoClosed: 1, lastRating: 1, lastOtherUser: 1, rated: 1, firstTime: 1, anon:1, xp: 1, xp_max: 1, level: 1}});
  session = Meteor.server.sessions[Object.keys(Meteor.server.sessions).filter((key) => {
    return Meteor.server.sessions[key].userId == userId;  
  })[0]];
  console.log("currentUser pub, session", session);
  session.socket.on('close', Meteor.bindEnvironment(() => {
    exitConvo(userId);
  }));
  return user;
});

Meteor.publish('userProfile', (username) => {
  return Meteor.users.find({username: username,}, {
    fields: { 
      username: 1,
      notratings: 1,
      sessions: 1,
      rating: 1,
      profPic: 1,
      badges: 1,
      anon: 1,
      xp: 1,
      xp_max: 1,
      level: 1
  }});
});

