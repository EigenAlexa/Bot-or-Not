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
        console.log("HOSTNAME", process.env.HOSTNAME);
        convoId = Convos.insert({
          closed: false,
          curSessions: 0,
          time: Date.now(),
          msgs: [msgId],
          hostID: !!Meteor.settings.hostID ? Meteor.settings.hostID : process.env.HOSTNAME, 
        });
        Messages.update({_id: msgId}, {$set: {convoId: convoId}});
        timeout = !!Meteor.settings.timeout ? Meteor.settings.timeout : 5;
        SyncedCron.add({
          name: convoId,
          schedule: (parser) => {
            let time = new Date(Date.now() + timeout * 1000);
            console.log(time);
            return parser.recur().on(time).fullDate();
          },
          job: () => {
            Meteor.call('startBot', convoId);
          },
        });
        console.log(SyncedCron.nextScheduledAtDate(convoId));
        return convoId;
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
      if(!!convoId) {
        console.log("adding user: ", userId, "to room ", convoId);
        Meteor.users.update({_id: userId}, {
          $set: {in_convo: true, curConvo: convoId, rated: false}
        });
        Convos.update({_id: convoId, "users.id": {$ne: userId}}, {
          $push: {users: {id: userId, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false}},
          $inc: {curSessions: 1}
        });
        convo = Convos.findOne({_id: convoId});
        if (!!convo && convo.curSessions > 1) {
          Meteor.call('convos.clearBotTimeout', convoId);
        }
      }
    },
    'convos.clearBotTimeout'(convoId) {
      if(!this.isSimulation) {
        if (!!SyncedCron.nextScheduledAtDate(convoId)) {
          SyncedCron.remove(convoId);
        }
      }
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
      Meteor.call('convos.clearBotTimeout', convoId);
    },
    'convos.finishConvoUserLeft'(convoId){
      convo = Convos.findOne({_id: convoId});
      convo.users.forEach( (user) => {
        Meteor.users.update({_id: user.id}, {
          $set: {convoClosed: true, left: true}
        });
      });
    },
    'convos.markOffTopic'(convoId, userId){
      console.log('marking convo off topic');
      convo = Convos.findOne({_id: convoId});
      console.log('marking convo off topic for user', userId)
      Convos.update({_id: convoId, "users.id": userId}, {
        $set: {"users.$.markedOffTopic": true}
      });
    },
    'convos.updateRatings'(convoId, userId, rating){
      console.log(userId);
      convo = Convos.findOne({_id: convoId});
      filteredUsers = convo.users.filter((user) => {
        return user.id !== userId;
      });
      console.log(filteredUsers[0]);
      if(!!filteredUsers){
        console.log(" user: " + filteredUsers[0].id);
        Convos.update({_id: convoId, "users.id": filteredUsers[0].id}, {
            $set: {"users.$.rated": rating}
        });
        console.log(" user: " + filteredUsers[0].id);
        Meteor.users.update({_id: filteredUsers[0].id}, {
            $set: {lastRating: rating, rated: true}
        });
        console.log("setting rated to true for: " + filteredUsers[0].id);
      }
      prob = Meteor.users.findOne({_id: userId}).prob;
      correct = Random.fraction() < prob;
      if(prob >= 0.9)
        probInc = 0;
      else
        probInc = 0.01;
      if(rating == 'not') {
        if(correct)
          lastOtherUser = rating;
        else
          lastOtherUser = 'bot';
      } else if (rating == 'bot'){
        if(correct)
          lastOtherUser = rating;
        else
          lastOtherUser = 'not';
      }
      Meteor.users.update({_id: userId}, {
        $inc: {prob: probInc},
        $set: {lastOtherUser: lastOtherUser}
      });

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
