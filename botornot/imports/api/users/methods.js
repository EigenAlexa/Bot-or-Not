import { Meteor } from 'meteor/meteor';
import { Convos } from '/imports/api/convos/convos.js';

Meteor.methods({
  'users.updateAnonymousUsername'() {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        username: faker.commerce.productAdjective() + faker.name.firstName(), 
        firstTime: true,
        anon : true,
      }
    });
  },
  'users.exitConvo'() {
    Meteor.users.update({_id: this.userId}, {
      $set: {in_convo: false, rated: false, isReady: false}
    });
    user = Meteor.users.findOne({_id: this.userId});
    convo = Convos.findOne({_id: user.curConvo});
    console.log("exiting convo ", convo._id, " user: ", this.userId);
    console.log("convo sessions ", convo.curSessions);
    Meteor.call('convos.finishConvo', convo._id);
    Meteor.call('convos.finishConvoUserLeft', convo._id);
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
    Meteor.users.update({_id: this.userId}, {$set: {rated: false}});
  },
  'users.getUserRanking'() {
    user = Meteor.users.findOne({_id: this.userId})
    rank = Meteor.users.find({rating: {$gt : user.rating}}).count() + 1
    return rank 
  } 
});
