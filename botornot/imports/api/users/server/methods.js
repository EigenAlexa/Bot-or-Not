import { userPool } from '/imports/startup/server/queueing.jsx';

Meteor.methods({
  'users.addUserToQueue': () => {
    let userId = Meteor.userId();
    if (!!userId) {
      user = Meteor.users.findOne({_id: userId});
      if ( !!user && !user.in_convo ) {
        console.log("Trying to add user", userId, "to pool");
        userPool.add(userId);
      }
    }
  },

  'users.removeUserFromQueue': () => {
    let userId = Meteor.userId();
    if(!!userId) {
      userPool.remove(userId);
    }
  },
  
  'convos.botReady'(convoId, userId, magicphrase) {
      if (magicphrase === Meteor.settings.magicPhrase) {
        if (!!convoId && !!userId) {
          userPool.addUserToRoom(convoId, userId);  
        }  
      }
  },
});
