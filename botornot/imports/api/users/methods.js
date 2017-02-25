import { Meteor } from 'meteor/meteor';
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
      $set: {username: faker.hacker.ingverb() + faker.hacker.noun()}
    })
  },
});
