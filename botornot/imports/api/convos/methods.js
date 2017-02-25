import { Convos } from './convos.js';
import { Messages } from '../messages/messages.js';
Meteor.methods({
    'convos.openrooms'() {
        return getOpenRooms();
    }, 
    'convos.newRoom'() {
        Convos.insert({
            closed: false,
            curSessions: 0,
        });
    },
    'convos.updateChat'(text, convoId, userId) {
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
        console.log(msg.user);
        console.log(userId);
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

    },
    'convos.addUserToRoom'(userId, convoId) {
      Convos.update({_id: convoId, users: {$nin: [{id: userId, ratedBot: false}]}}, {
        $push: {users: {id: userId, ratedBot: false}},
        $inc: {curSessions: 1}
      });
      Meteor.users.update({_id: userId}, {
        $set: {in_convo: true, curConvo: convoId}
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
      Meteor.users.update({_id: userId}, {
        $set: {in_convo: false} 
      });


      users = convo.users.filter((user) => {
        return user.id !== userId;
      }).map((user) => {
        return user.id
      });
      if(!!users){
        if(rating == 'not'){
          Meteor.users.update({_id: users[0]}, {
            $inc: {sessions: 1, notratings: 1}
          });
          Convos.update({_id: convoId, "users.id": users[0]}, {
            $set: {"users.$.ratedBot": false}
          });
        } else if (rating == 'bot'){
          Meteor.users.update({_id: users[0]}, {
            $inc: {sessions: 1}
          });
          Convos.update({_id: convoId, "users.id": users[0]}, {
            $set: {"users.$.ratedBot": true}
          }); 
        }
      }

    },
});
function getOpenRooms() {
    // get all convos that have less than two people and aren't closed yet
    // filter all room.curssions < 2 and closed = false
    convos = Convos.find({

        closed: false,
        curSessions : {$lt: 12}
    }).fetch();
    console.log(convos);
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
