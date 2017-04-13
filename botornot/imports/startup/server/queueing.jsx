import { startBot } from '/imports/api/utils/bots.js';
var OrderedHashMap = require('ordered-hashmap');
import { Messages } from '/imports/api/messages/messages.js';
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { Random } from 'meteor/random';

const botTimeout = !!Meteor.settings.timeout ? Meteor.settings.timeout * 1000 : 5000;

class UserPool {
  constructor() {
    this.pool = new OrderedHashMap();    
    this.adminPool = new OrderedHashMap();
  }

  connectTwoUsers(userId, pool1, pool2) {
    //Connects two users from pool1 and pool2
    //pool1 is pool of userId
    //pool2 is where to get second user from
    
    console.log("connecting two users");
    pool1.set(userId, {timeout: null});
    user1 = pool2.keyAt(0);
    Meteor.clearTimeout(pool2.get(user1).timeout);
    user2 = userId;

    convoId = this.makeNewRoom();
    this.addUserToRoom(convoId, user1);
    this.addUserToRoom(convoId, user2);
    //this.addUsersToRoom(convoId, user1, user2);
    pool2.remove(user1);
    pool1.remove(user2);

  }

  add(userId) {
    user = Meteor.users.findOne({_id: userId});
    if (user.admin) {
      if (this.adminPool.indexOf(userId) === -1) {
        if ( this.pool.count() >= 1 ) {
          this.connectTwoUsers(userId, this.adminPool, this.pool);
        } else {
          this.adminPool.set(userId, {timeout: null});
        }
      }
    } else {
      if (this.pool.indexOf(userId) == -1) {
        console.log("adding user", userId, "to pool");
        if (this.adminPool.count() >= 1 ) {
          this.connectTwoUsers(userId, this.pool, this.adminPool);
        } else if( this.pool.count() >= 1 ) {
          this.connectTwoUsers(userId, this.pool, this.pool);
        } else {
          console.log("pool count: ", this.pool.count());
          this.pool.set(userId, {timeout: Meteor.setTimeout(() => {
            console.log("starting bot");
            convoId = this.makeNewRoom();
            result = startBot(convoId, userId);
            if ( result ) {
              this.pool.remove(userId);
            }
          }, botTimeout)});
        }
      }
    } 
  }

  remove(userId) {
    if (user.admin) {
      this.removeUserFromPool(userId, this.adminPool);
    } else {
      this.removeUserFromPool(userId, this.pool);
    }
  }

  removeUserFromPool(userId, pool) {
    if (pool.indexOf(userId) !== -1 ) {
      this.clearTimeout(userId, pool);
      return pool.remove(userId);
    }
  }
 
  clearTimeout(userId, pool) {
    let timeout = pool.get(userId).timeout;
    if (!!timeout) {
      Meteor.clearTimeout(timeout);    
    }
  }
   
  makeNewRoom() {
    

    convoId = Convos.insert({
      closed: false,
      curSessions: 0,
      time: Date.now(),
      msgs: [],
      hostID: !!Meteor.settings.hostID ? Meteor.settings.hostID : process.env.HOSTNAME,
    });
   
    threshold = !!Meteor.settings.percentPrompted ? Meteor.settings.percentPrompted : 0.5;
    shouldAddPrompt = Random.fraction() < threshold;

    if (shouldAddPrompt) {
      msgId = Messages.insert({
        user: "null",
        message: Prompts.aggregate([ { $sample: {size: 1} } ])[0].text,
        time: Date.now(),
        convoId: "null"
      });
      Messages.update( {_id: msgId}, {$set: {convoId: convoId}} );
      Convos.update({_id: convoId}, {
        $push: {msgs: msgId}
      });
    }

    return convoId;

  }

  addUserToRoom(convoId, userId) {

    convo = Convos.findOne({_id: convoId});
    user = Meteor.users.findOne({_id: userId});
    if ( !!convo && !!user ) {
      console.log("adding user", userId, "to room", convoId);
      Meteor.users.update({_id: userId}, {
        $set: {in_convo: true, curConvo: convoId, rated: false}
      });

      Convos.update({_id: convoId}, {
        $push: {users: {id: userId, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false}},
        $inc: {curSessions: 1}
      });   
    
    } else {
      console.log('invalid convoId or userId when trying to add user');
    }

  }

  addUsersToRoom(convoId, userId1, userId2) {
    convo = Convos.findOne({_id: convoId});
    user1 = Meteor.users.findOne({_id: userId1});
    user2 = Meteor.users.findOne({_id: userId2});
    if ( !!convo && !!user1 && !!user2 ) {
      console.log("adding users", userId1, userId2, "to room", convoId);

      Meteor.users.update({_id: {$in: [userId1, userId2]}}, {
        $set: {in_convo: true, curConvo: convoId, rated: false}
      });

      Convos.update({_id: convoId}, {
        $set: {users: [{id: userId1, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false}, 
                       {id: userId2, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false}],
               curSessions: 2},
      });
      
    } 
  }
}

var userPool = new UserPool();

export { userPool };
