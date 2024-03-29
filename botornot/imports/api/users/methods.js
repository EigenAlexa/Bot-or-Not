import { Meteor } from 'meteor/meteor';
import { Convos } from '/imports/api/convos/convos.js';
import { finishConvoUserLeft } from '/imports/api/convos/methods.js';

Meteor.methods({
  'users.updateAnonymousUsername'() {
    if (!!this.userId) {
      user = Meteor.users.findOne({_id: this.userId});
      if (!!user) {
        Meteor.users.update({_id: this.userId}, {
          $set: {
            username: faker.commerce.productAdjective() + faker.name.firstName(), 
            firstTime: true,
            anon : true,
          }
        });
      }
    }
  },
  'users.exitConvo'() {
    let userId = Meteor.userId();
    exitConvo(userId); 
  },
  'users.nextChatAfterRate'() {
    let userId = Meteor.userId();
    if (!!userId) {
      nextChatAfterRate(userId);
    }
  },
  'getBotUsername'(magicphrase){
    if(magicphrase=== Meteor.settings.magicPhrase) {
      console.log('getting username');
      let username = '';
      while (username === '' && !(Meteor.users.findOne({username: username}))) {
        username = faker.commerce.productAdjective() + faker.company.bsBuzz();
      }
      console.log('got username', username);
      let user_dict = {'user' : username, 'pwd' : Meteor.settings.botPassword};
      Accounts.createUser({
        username : user_dict['user'],
        password : user_dict['pwd']
      });
      return user_dict
    } else {
      return 'nice try hacker man';
    }
  }, 
  'users.setRated'(){
    if (!!this.userId) {
      Meteor.users.update({_id: this.userId}, {$set: {rated: false}});
    }
  },
  'users.getUserRanking'(username) {
    if (!!username) {
      user = Meteor.users.findOne({username: username})
      if (!!user && !!user.rating) {
        rank = Meteor.users.find({rating: {$gt : user.rating}}).count() + 1
        return rank 
      }
    }
  } 
});

  
exitConvo = (userId) => {
  if (!!userId) {
    Meteor.users.update({_id: userId}, {
      $set: {in_convo: false, rated: false, isReady: false}
    });
    Meteor.call('users.removeUserFromQueue');
    user = Meteor.users.findOne({_id: userId});
    if (!!user && !!user.curConvo) {
      convo = Convos.findOne({_id: user.curConvo});
      if (!!convo && !!convo._id) {
        console.log("exiting convo ", convo._id, " user: ", userId);
        finishConvoUserLeft(convo._id, userId);
      }
    }
  }
}

nextChatAfterRate = (userId) => {
  Meteor.users.update({_id: userId}, {
    $set: {rated: false, isReady: false}
  });
  Meteor.call('users.removeUserFromQueue');
  user = Meteor.users.findOne({_id: userId});
  if (!!user && !!user.curConvo) {
    convo = Convos.findOne({_id: user.curConvo});
    if (!!convo && !!convo._id) {
      console.log("exiting convo ", convo._id, " user: ", userId);
      Meteor.call('convos.finishConvoUserLeft', convo._id);
    }
  }
}

export { exitConvo };
