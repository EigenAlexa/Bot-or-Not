import { Meteor } from 'meteor/meteor';
import { Convos } from './convos.js';
import { Messages } from '../messages/messages.js';
import { Random } from 'meteor/random';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { validate } from '/imports/api/messages/validation.js';
import { startBot } from '/imports/api/utils/bots.js';

Meteor.methods({
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
            startBot(convoId);
          },
        });
        console.log(SyncedCron.nextScheduledAtDate(convoId));
        return convoId;
      }
    },
  
    'convos.updateChat'(text, convoId) {
      userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('unauthorized');
      } else {
        convoObj = Convos.findOne({'_id' : convoId, "users.id": userId});
        if (!!convoObj) {
          convoClosed = convoObj.closed;

          result = validate(text, convoId, true);
          if(result.valid && !convoClosed){
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
        }
      }
    },
  
    'convos.addUserToRoom'(convoId) {
      userId = this.userId;
      if(!!convoId && !!userId) { // check that userId and convoId exist

        convo = Convos.findOne({_id: convoId, "users.id": {$ne: userId}});
        if (!!convo && convo.curSessions < 2) { 
          // check that the convo doesn't already have the user 
          // and the conversation has less than 2 people in it

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
      }
    },
  
    'convos.clearBotTimeout'(convoId) {
      if(!this.isSimulation) {
        if (!!SyncedCron.nextScheduledAtDate(convoId)) {
          SyncedCron.remove(convoId);
        }
      }
    },
  
    'convos.finishConvoUserStayed'(convoId) {
      if (!!convoId && !!this.userId) {
        convo = Convos.findOne({_id: convoId, "users.id": this.userId});
        
        //check that convo exists, user is in that convo and the convo has enough turns
        if (!!convo && convo.turns >= Meteor.settings.public.ratingTurns) {
          Convos.update({_id: convoId}, {
            $set: {closed: true, curSession: 0}
          });
          Meteor.call('convos.clearBotTimeout', convoId);
          convo.users.forEach( (user) => {
            Meteor.users.update({_id: user.id}, {
              $set: {left: false, convoClosed: true}
            });
          });
          
        }
      }
    },

    'convos.finishConvoUserLeft'(convoId){
      if (!!convoId && !!this.userId) {
        convo = Convos.findOne({_id: convoId, "users.id": this.userId});
        
        //check that convo exists and the user is in that convo
        if (!!convo) { 
          Convos.update({_id: convoId}, {
            $set: {closed: true, curSession: 0}
          });
          Meteor.call('convos.clearBotTimeout', convoId);
          convo.users.forEach( (user) => {
            Meteor.users.update({_id: user.id}, {
              $set: {convoClosed: true, left: true}
            });
          });
        }
      }
    },

    'convos.markOffTopic'(convoId){
      if (!!convoId && !!this.userId) {
        Convos.update({_id: convoId, "users.id": this.userId}, {
          $set: {"users.$.markedOffTopic": true}
        });
      }
    },

    'convos.updateRatings'(convoId, rating){
      userId = this.userId;
      if (!!convoId && !!rating && !!userId) {
        convo = Convos.findOne({_id: convoId, "users.id": userId});
        
        if (!!convo) {
          filteredUsers = convo.users.filter((user) => {
            return user.id !== userId;
          });

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
            probInc = 0.005;
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

    // Feature regression;
    // The thought process here is we let the players be deliusional 
    // 95.5 percent of the time.
    // <<<<<<< f6c710320bfa3dd23f2acaf630064d065ebb2103
    //         probInc = 0.01;
    //       if(correct)
    //           lastOtherUser = convo.hasBot ? 'bot' : 'not';
    //       else
    //           lastOtherUser = convo.hasBot ? 'not' : 'bot';
    // =======
          if (!!lastOtherUser && !!correct) {
            Meteor.users.update({_id: userId}, {
              $inc: {prob: probInc},
              $set: {lastOtherUser: lastOtherUser}
            });
          }
          
          deltaXp = calculateAndUpdateXp(correct, userId);
          return deltaXp;
        }
      }
    },

  'convos.makeReady'(convoId){
    userId = this.userId;
    if (!!convoId && !!userId) {
      Convos.update({_id: convoId, "users.id": userId}, {
        $set: {"users.$.isReady": true}
      });
      if(Meteor.users.findOne({_id: userId}).firstTime){
        Meteor.users.update({_id: userId}, {
          $set: {firstTime: false} 
        });
      }
    }
  },

  'convos.incUserEnglishCount'(convoId){
      userId = this.userId;
      if (!!convoId && !!userId) {
        Convos.update({_id: convoId, "users.id": userId}, {
          $inc: {"users.$.englishCount": 1}
        });
      }
  },

  'convos.resetUserEnglishCount'(convoId){
    userId = this.userId;
    if (!!convoId && !!userId) {
      Convos.update({_id: convoId, "users.id": userId}, {
        $set: {"users.$.englishCount": 0}
      });
    }
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


function calculateAndUpdateXp(correct, userId){
    //Do XP Stuff.
  const cur_user = Meteor.users.findOne({_id: userId});
  const curLevel = cur_user.level;
  const curXP = cur_user.xp;
  const maxXP = cur_user.xp_max;

  const num_convs = 2*Math.pow(curLevel, 1.1) + 0.5*Math.pow(curLevel,0.5) -0.9;

  const baseXPIncr = maxXP/num_convs;

  const multiplier = correct ? 1 : 0.05; 
  const randBonus = 0.4*(Math.random() - 0.75)*baseXPIncr;
  const deltaXP = Math.ceil(Math.max(Math.floor(baseXPIncr + randBonus),22)*multiplier);

  const newXP = Math.round(curXP+ deltaXP);
  console.log(cur_user);
  console.log(num_convs);
  console.log(baseXPIncr);
  console.log(randBonus);
  console.log(userId, " gaining ", deltaXP, " at level", curLevel, " with max XP", maxXP);

  if (newXP > maxXP){
    levelUp(userId, Math.round(newXP - maxXP));
  }else{
    Meteor.users.update({_id: userId}, {
      $set: {xp: parseInt(newXP)}
    });
  }

  let update = {
    delta_xp: deltaXP,
    level_up: newXP > maxXP,
    correct: correct
  };
  return update;
}

function levelUp(userId, remainingXP){
  const cur_user = Meteor.users.findOne({_id: userId});
  const l = cur_user.level + 1;
  const newMaxXP = 300 + 421 * l *l;
  console.log(userId, " leveling up", newMaxXP);

  Meteor.users.update({_id: userId}, {
    $inc: {level: 1},
    $set: {xp: parseInt(remainingXP), xp_max: parseInt(newMaxXP)}
  });
}

