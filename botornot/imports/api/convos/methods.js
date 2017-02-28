import { Meteor } from 'meteor/meteor';
import { Convos } from './convos.js';
import { Messages } from '../messages/messages.js';
import { Random } from 'meteor/random';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { validate } from '/imports/api/messages/validation.js';

Meteor.methods({
    'convos.openrooms'() {
        return getOpenRooms();
    }, 
    'convos.newRoom'() {
      if(!this.isSimulation){
        msgId = Messages.insert({
          user: "null",
          message: Prompts.aggregate([ { $sample: {size: 1} } ])[0].text,
          time: Date.now(),
          convoId: "null"
        });
        convoId = Convos.insert({
          closed: false,
          curSessions: 0,
          time: Date.now(),
          msgs: [msgId],
        });
        Messages.update({_id: msgId}, {$set: {convoId: convoId}});
        timeout = !!Meteor.settings.timeout ? Meteor.settings.timeout : 5;
        Meteor.setTimeout(() => {
          Meteor.call('startBot', convoId);
        }, timeout * 1000);
      }
    },
    'convos.updateChat'(text, convoId, userId) {
        
      result = validate(text, convoId, true);
      if(result.valid){
        const msgId = Messages.insert({
          user: userId,
          message: text,
          time: Date.now(),
          convoId: convoId
        });
        convo = Convos.findOne({_id: convoId});
        if(convo.msgs.length == 0){
          update = true;
        }else{
          msg = Messages.findOne({_id: convo.msgs[convo.msgs.length - 1]})
          if (msg.user != userId){
            update = true;
          }else{
            update = false;
          }
        }
        if(update){
          Convos.update({_id: convoId}, {
            $inc: {turns: 1}
          });
        }      
        Convos.update({_id: convoId}, {
          $push: {msgs: msgId},
          $inc: {length: 1}
        });
      }
    },
    'convos.addUserToRoom'(userId, convoId) {
      Convos.update({_id: convoId, "users.id": {$ne: userId}}, {
        $push: {users: {id: userId, ratedBot: false, isReady: false, englishCount: 0}},
        $inc: {curSessions: 1}
      });
      Meteor.users.update({_id: userId}, {
        $set: {in_convo: true, curConvo: convoId, rated: false}
      });
    },
    'convos.finishConvoUsers'(convoId) {
      convo = Convos.findOne({_id: convoId});
      convo.users.forEach( (user) => {
        Meteor.users.update({_id: user.id}, {
          $set: {left: false, convoClosed: true}
        });
      });
    },
    'convos.finishConvo'(convoId){
      Convos.update({_id: convoId}, {
        $set: {closed: true, curSession: 0}
      });
    },
    'convos.finishConvoUserLeft'(convoId){
      convo = Convos.findOne({_id: convoId});
      convo.users.forEach( (user) => {
        Meteor.users.update({_id: user.id}, {
          $set: {convoClosed: true, left: true}
        });
      });
    },
    'convos.updateRatings'(convoId, userId, rating){
      convo = Convos.findOne({_id: convoId});
      users = convo.users.filter((user) => {
        return user.id !== userId;
      }).map((user) => {
        return user.id
      });
      if(!!users){
        prob = Meteor.users.findOne({_id: users[0]}).prob;
        correct = Random.fraction() < prob;
        if(prob >= 0.7){
          probInc = 0;
        }else{
          probInc = 0.01;
        }
        if(rating == 'not'){
          if(correct){
            lastOtherUser = rating;
          }else{
            lastOtherUser = 'bot';
          }
          Meteor.users.update({_id: users[0]}, {
            $inc: {sessions: 1, notratings: 1, prob: probInc},
            $set: {lastRating: rating, lastOtherUser: lastOtherUser, rated: true}
          });
          Convos.update({_id: convoId, "users.id": users[0]}, {
            $set: {"users.$.ratedBot": false}
          });
        } else if (rating == 'bot'){
          if(correct){
            lastOtherUser = rating;
          }else{
            lastOtherUser = 'not';
          }Meteor.users.update({_id: users[0]}, {
            $inc: {sessions: 1, prob: probInc},
            $set: {lastRating: rating, lastOtherUser: lastOtherUser, rated: true}
          });
          Convos.update({_id: convoId, "users.id": users[0]}, {
            $set: {"users.$.ratedBot": true}
          }); 
        }
      }

    },
  'convos.makeReady'(convoId, userId){
    Convos.update({_id: convoId, "users.id": userId}, {
      $set: {"users.$.isReady": true}
    });
    if(Meteor.users.findOne({_id: userId}).firstTime){
      Meteor.users.update({_id: userId}, {
        $set: {firstTime: false} 
      });
    }
  },
  'convos.incUserEnglishCount'(convoId, userId){
      Convos.update({_id: convoId, "users.id": userId}, {
        $inc: {"users.$.englishCount": 1}
      });
  },
  'convos.resetUserEnglishCount'(convoId, userId){
    Convos.update({_id: convoId, "users.id": userId}, {
      $set: {"users.$.englishCount": 0}
    });
  }
});
function getOpenRooms() {
    // get all convos that have less than two people and aren't closed yet
    // filter all room.curssions < 2 and closed = false
    convos = Convos.find({

        closed: false,
        curSessions : {$lt: 2}
    }).fetch();
    return convos;
}
export const makeNewRoom = () => {
    // makes a new convo and returns the roomId
    //
    return 0;
}


export const addToRoom = (sessionId, roomId) => {
    // adds a session to the room with the id
    // if room.cursessions >= 2 after add, then set closed = true 
    // subscribes the current user to the room object
}

export const readyTochat = (roomId) => {
    // returns a boolean of whether the room has 2 sessions and is 
    // ready to go 
}
