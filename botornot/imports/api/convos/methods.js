import { Meteor } from 'meteor/meteor';
import { Convos } from './convos.js';
import { Messages } from '../messages/messages.js';
import { Random } from 'meteor/random';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { validate } from '/imports/api/messages/validation.js';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Meteor.methods({
    
		'convos.addUserToRoom'(convoId, magicphrase) {
      if(magicphrase=== Meteor.settings.magicPhrase) {
				let userId = Meteor.userId();
				if(!!convoId && !!userId) { // check that userId and convoId exist

					convo = Convos.findOne({_id: convoId, "users.id": {$ne: userId}});
					if (!!convo && convo.curSessions < 2) { 
						// check that the convo doesn't already have the user 
						// and the conversation has less than 2 people in it
						let rn = Random.id(); // add random number to check and see whehter userId switches for some reason
						// console.log("adding user: ", userId, "to room ", convoId);
						console.log(rn, 'convo pre adding for user', userId, ':', convo);
						Meteor.users.update({_id: userId}, {
							$set: {in_convo: true, curConvo: convoId, rated: false}
						});
						numUpdated = Convos.update({_id: convoId, "users.id": {$ne: userId}}, {
							$push: {users: {id: userId, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false, bot: true}},
							$inc: {curSessions: 1}
						});
						console.log(rn, 'updated',numUpdated, 'docs in convo update');
						convo = Convos.findOne({_id: convoId});
						console.log(rn, 'convo post adding', userId, ':', convo);
						if ( !userAddedToConvo(Meteor.users.findOne({_id : userId}), convo) ) {
							throw new Meteor.Error('user', userId, ' was not successfully added to convo');
						}
					} else if (!convo) {
						console.log('convo is undefined. Checking if convoId is valid');
						checkConvo = Convos.findOne({_id : convoId});
						if (!!checkConvo) {
							console.log('convoId is valid, but user', userId, 'has already been added to room');
							console.log(checkConvo);
						}
						else {
							console.log('could not find convo with convoID', convoId);
						}
					} else {
						console.log('curSessions is erroneously > 2', convo);
					}
				}
				else {
					console.log('add user to room failed; convoId:', convoId, '; userId:', userId);
				}
			} else {
				console.log("magic phrase failed");
			}
    },
  
    'convos.updateChat'(text, convoId) {
      let userId = Meteor.userId();
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
  
   
    'convos.finishConvoUserStayed'(convoId) {
      if (!!convoId && !!Meteor.userId()) {
        convo = Convos.findOne({_id: convoId, "users.id": Meteor.userId()});
        
        //check that convo exists, user is in that convo and the convo has enough turns
        if (!!convo && convo.turns >= Meteor.settings.public.ratingTurns) {
          Convos.update({_id: convoId}, {
            $set: {closed: true, curSession: 0}
          });
          convo.users.forEach( (user) => {
            Meteor.users.update({_id: user.id}, {
              $set: {left: false, convoClosed: true}
            });
          });
          
        }
      }
    },

    'convos.finishConvoUserLeft'(convoId){
      finishConvoUserLeft(convoId, Meteor.userId());      
    },

    'convos.markOffTopic'(convoId){
      if (!!convoId && !!Meteor.userId()) {
        Convos.update({_id: convoId, "users.id": Meteor.userId()}, {
          $set: {"users.$.markedOffTopic": true}
        });
      }
    },

    'convos.updateRatings'(convoId, rating){
      let userId = Meteor.userId();
      if (!!convoId && !!rating && !!userId) {
        convo = Convos.findOne({_id: convoId, "users.id": userId});
        
        if (!!convo) {
          prob = Meteor.users.findOne({_id: userId}).prob;
          correct = Random.fraction() < prob; 

          if(prob >= 0.65)
            probInc = 0;
          else
            probInc = 0.001;

          otherUser = Meteor.users.findOne({_id: {$in: convo.users.map((user) => {return user.id}), $ne: userId}});

          if (otherUser.admin) {
            lastOtherUser = 'bot';
          } else {          

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
          }

          console.log("lastOtherUser methods", lastOtherUser);
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
          if (!!lastOtherUser) {
            Meteor.users.update({_id: userId}, {
              $inc: {prob: probInc},
            });
          }
          
          filteredUsers = convo.users.filter((user) => {
            return user.id !== userId;
          });
          Convos.update({_id: convo._id, "users.id": userId}, {
            $set: {"users.$.lastOtherUser": lastOtherUser }
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
          console.log("Correct", correct);
          deltaXp = calculateAndUpdateXp(correct, userId, convoId);
          return deltaXp;
        }
      }
    },

  'convos.incUserEnglishCount'(convoId){
      let userId = Meteor.userId();
      if (!!convoId && !!userId) {
        Convos.update({_id: convoId, "users.id": userId}, {
          $inc: {"users.$.englishCount": 1}
        });
      }
  },

  'convos.resetUserEnglishCount'(convoId){
    let userId = Meteor.userId();
    if (!!convoId && !!userId) {
      Convos.update({_id: convoId, "users.id": userId}, {
        $set: {"users.$.englishCount": 0}
      });
    }
  }
});


function calculateAndUpdateXp(correct, userId, convoId){
    //Do XP Stuff.
  const cur_user = Meteor.users.findOne({_id: userId});
  const curLevel = cur_user.level;
  const other_level = getRandomIntInclusive(Math.max(1, curLevel-2), curLevel+3)

  const curXP = cur_user.xp;
  const maxXP = cur_user.xp_max;

  // This is a hand tuned equation for the number of conversations
  // needed to level up at curLevel
  const num_convs = 2*Math.pow(curLevel, 1.1) + 0.5*Math.pow(curLevel,0.5) -0.9;

  // You should roughly have num_convs to level up, therefore each time 
  // a user converses they'll get the appropriate proportion.
  const baseXPIncr = maxXP/num_convs;

  // We multiply whatever the increase in XP is by near 0 if the user was
  // incorrect in rating. Furthermore we increase/decrease the multiplier based
  // on the other users level.
  const multiplier = (correct ? 1 : 0.05)*((other_level - curLevel)/10.0 + 1.0); 
  const randBonus = 0.4*(Math.random() - 0.75)*baseXPIncr;
  convo = Convos.findOne({_id: convoId}); 
  const lengthBonus = 0.05 * convo.turns * baseXPIncr;
  // You can't get less XP than 22.
  const deltaXP = Math.ceil(Math.max(Math.floor(baseXPIncr + randBonus + lengthBonus),22)*multiplier);

  const newXP = Math.round(curXP+ deltaXP);
  console.log('user', 'num_convs', 'baseXPIncr', 'randBonux');
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
    correct: correct,
    other_level: other_level
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

function userAddedToConvo(userObj, convoObj) {
  /* Checks whether a user has been added to the convo */
  let users = convoObj.users;
  let userId = userObj._id;
  if (userObj.curConvo != convoObj._id) {
    console.log('curConvo of user', userId, 'doesn\'t match the convoObj');
    console.log('expected:', convoObj._id, '; actual:', userObj.curConvo);
    return false;
  }
  for (let i = 0; i < users.length; i ++) {
    let curUser = users[i];
    if (curUser.id == userId) {
      return true;
    }
  }
  return false;
}

finishConvoUserLeft = (convoId, userId) => {
  if (!!convoId && !!userId) {
    convo = Convos.findOne({_id: convoId, "users.id": userId});
    
    //check that convo exists and the user is in that convo
    if (!!convo) { 
      Convos.update({_id: convoId}, {
        $set: {closed: true, curSession: 0}
      });
      convo.users.forEach( (user) => {
        Meteor.users.update({_id: user.id}, {
          $set: {convoClosed: true, left: true}
        });
      });
    }
  }

}

export { finishConvoUserLeft };
