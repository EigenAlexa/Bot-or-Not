import { userPool } from '/imports/startup/server/queueing.jsx';

Meteor.methods({
  'users.addUserToQueue': () => {
    if (!!this.userId) {
      user = Meteor.users.findOne({_id: this.userId});
      if ( !!user && !user.in_convo ) {
        userPool.add(this.userId);
      }
    }
  },

  'users.removeUserFromQueue': () => {
    if(!!this.userId) {
      userPool.remove(this.userId);
    }
  },

});
