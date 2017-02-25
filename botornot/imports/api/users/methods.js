import { Meteor } from 'meteor/meteor';
import { Convos } from '/imports/api/convos/convos.js';
/**Meteor.methods({
  'users.getTopN'(N) {
    cursor = Meteor.users.find({}, {
      sort: {rating: -1}, 
      limit: N}
      );
    return cursor.fetch();  
  }
});
*/
/***
UserPresence.onSessionDisconnected((connection) => {
  console.log(connection);
  console.log(Meteor.server.sessions);
});
**/
Meteor.methods({
  'users.updateAnonymousUsername'(userId) {
    user_no = 
    Meteor.users.update({_id: userId}, {
      $set: {username: faker.hacker.ingverb() + faker.hacker.noun(), firstTime: true}
    });
  },
  'users.exitConvo'(userId) {
    console.log(userId, " left");
    Meteor.users.update({_id: userId}, {
      $set: {in_convo: false, rated: false, isReady: false}
    });
    query = {closed: false, users: {$in: [{id: userId, ratedBot: false}]}};
    convo = Convos.findOne(query);
    Meteor.call('convos.finishConvo', convo._id);
    Meteor.call('convos.finishConvoUserLeft', convo._id);
  },
  
});
