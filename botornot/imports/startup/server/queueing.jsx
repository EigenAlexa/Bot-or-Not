import { startBot } from '/imports/api/utils/bots.js';
var OrderedHashMap = require('ordered-hashmap');
import { Messages } from '/imports/api/messages/messages.js';
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { Random } from 'meteor/random';
import { redisCall } from '/imports/api/utils/redis.js'; 


const botTimeout = !!Meteor.settings.timeout ? Meteor.settings.timeout * 1000 : 5000;

class UserPool {
  constructor() {
    this.redisQueue = new RedisQueue(redisCall);
  }

  connectTwoUsers(userId, pool1, pool2) {
    //Connects two users from pool1 and pool2
    //pool1 is pool of userId
    //pool2 is where to get second user from
    
    console.log("connecting two users");
    this.redisQueue.getUser(pool2, Meteor.bindEnvironment((user) => {
      convoId = this.makeNewRoom();
      this.addUserToRoom(convoId, user);
      this.addUserToRoom(convoId, userId);
      //this.addUsersToRoom(convoId, user1, user2);
      this.redisQueue.remove(userId, pool1);
    }));

  }

  add(userId) {
    user = Meteor.users.findOne({_id: userId});
    if (user.admin) {
      this.redisQueue.count('user', Meteor.bindEnvironment((count) => {
        if ( count >= 1 ) {
          this.connectTwoUsers(userId, 'admin', 'user');
        } else {
          this.redisQueue.add(userId, 'admin');
        }
      }));
    } else {  
      this.redisQueue.count('admin', Meteor.bindEnvironment((count) => {
        if (count >= 1 ) {
          this.connectTwoUsers(userId, 'user', 'admin');
        } else {
          this.redisQueue.count('user', Meteor.bindEnvironment((count) => {
            if (count >= 1) {
              this.redisQueue.inPool(userId, 'user', Meteor.bindEnvironment((inPool) => {
                if (inPool !== 1) {
                  this.connectTwoUsers(userId, 'user', 'user');
                } else {
                  console.log("already in pool");
                }
              }));
            } else {
              console.log("adding user", userId, "to pool");
              this.redisQueue.add(userId, 'user');
              //TODO figure out bots
            }
          }));
        } 
      }));
    } 
  }

  remove(userId) {
    if (user.admin) {
      this.redisQueue.remove(userId, 'admin');
    } else {
      this.redisQueue.remove(userId, 'user');
    }
  }

//  clearTimeout(userId, pool) {
//    let timeout = pool.get(userId).timeout;
//    if (!!timeout) {
//     Meteor.clearTimeout(timeout);    
//    }
//  }
   
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

class RedisQueue {
  constructor(redisCall) {
    this.redisCall = redisCall;
    this.redisCall((r) => {
      r.del('userSet');
      r.del('adminSet');
    });
  }

  add(userId, pool) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.sadd('adminSet', userId, (err, reply) => {
          if (!!err) {
            console.error(err); 
          }
        });
      });
    } else if (pool == 'user') {
      this.redisCall((r) => {
        r.sadd('userSet', userId);
      });
    }
  }

  remove(userId, pool) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.srem('adminSet', userId);
      });
    } else if (pool === 'user') {
      this.redisCall((r) => {
        r.srem('userSet', userId);
      });
    }
  }

  inPool(userId, pool, callback) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.sismember('adminSet', userId, (err, reply) => {
          if (!!err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });
    } else if (pool === 'user') {
       this.redisCall((r) => {
        r.sismember('userSet', userId, (err, reply) => {
          if (!!err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });     
    }
  }

  count(pool, callback) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.scard('adminSet', (err, reply) => {
          if (!!err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });

    } else if (pool === 'user') {
      this.redisCall((r) => {
        r.scard('userSet', (err, reply) => {
          if (!!err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });
    }

  }

  getUser(pool, callback) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.spop('adminSet', (err, reply) => {
          if (err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });
    } else if (pool === 'user') {
      this.redisCall((r) => {
         r.spop('userSet', (err, reply) => {
          if (err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
      });
    }
  }

} 

var userPool = new UserPool();

export { userPool };
