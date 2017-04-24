import { startBot } from '/imports/api/utils/bots.js';
var OrderedHashMap = require('ordered-hashmap');
import { Messages } from '/imports/api/messages/messages.js';
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { Random } from 'meteor/random';
import { redisCall, pubSub } from '/imports/api/utils/redis.js'; 
var RedisCluster = require('redis-cluster').clusterClient;

const botTimeout = !!Meteor.settings.timeout ? Meteor.settings.timeout * 1000 : 5000;

class UserPool {
  constructor() {
    this.redisQueue = new RedisQueue(redisCall);
		this.timeoutMap = new OrderedHashMap();
  //  RedisCluster.redisLinks[0].link.on('message', function (channel, message) {
  //    console.log("message", message);
  //    if (channel == 'timeouts') {
  //      if (this.timeoutMap.indexOf(message) !== -1) {
  //        this.clearTimeout(message);
  //      }
  //    }
  //  });
		pubSub((r) => {
			r.subscribe('timeouts', ((err, reply) => {
        console.log(reply);
        console.log(userPool.timeoutMap.items());
        if (this.timeoutMap.indexOf(reply[2]) !== -1) {
          this.clearTimeout(reply[2]);
          console.log("clearing timeout from other server for user", reply[2]);
        }
      }).bind(this));
		}, (channel, message) => {        
      console.log("sub channel", channel);
      console.log("sub userId", message);
      if (channel == 'timeouts') {
        console.log(this.timeoutMap.indexOf(message));
        console.log(this.timeoutMap.items());
        
      }
    });
    pubSub(Meteor.bindEnvironment((r) => {
			r.subscribe('addUserToRoom', Meteor.bindEnvironment(((err, reply) => {
        console.log(reply);
        if (!!reply[2].split) {
          userConvo = reply[2].split(",");
          userId = userConvo[0];
          convoId = userConvo[1];
          console.log(userId);
          console.log(convoId);
          this.addUserToRoom(userId, convoId, true);
        }
      }).bind(this)));
		}), (channel, message) => {});
  }

  connectTwoUsers(userId, pool1, pool2) {
    //Connects two users from pool1 and pool2
    //pool1 is pool of userId
    //pool2 is where to get second user from
    console.log("connecting two users");
    this.redisQueue.getUser(pool2, Meteor.bindEnvironment((user) => {
        convoId = this.makeNewRoom();
        this.addUserToRoom(convoId, user, false);
        this.addUserToRoom(convoId, userId, false);
        this.remove(userId);
        this.clearTimeout(user);
      //this.addUsersToRoom(convoId, user1, user2);
      
    }));

  }

  add(userId) {
    user = Meteor.users.findOne({_id: userId});
    if (!!user && !user.in_convo) {
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
                    console.log("timeoutmap items", this.timeoutMap.items());
                  }
                }));
              } else {
                console.log("adding user", userId, "to pool");
                this.redisQueue.add(userId, 'user', Meteor.bindEnvironment((err, reply) => {
                this.timeoutMap.set(userId, {timeout: Meteor.setTimeout(() => {
                  let userObj = Meteor.users.findOne({_id: userId});
                  if (!userObj.in_convo) {
                    console.log("starting bot");
                    console.log(userId);
                    convoId = this.makeNewRoom();
                    result = startBot(convoId, userId);
                    if ( result ) {
                      this.redisQueue.remove(userId, 'user');
                    }
                  }
                }, botTimeout)});
                console.log(this.timeoutMap.items());
                }).bind(this));
              }
            }));
          } 
        }));
      }
    } 
  }

  remove(userId) {
    user = Meteor.users.findOne({_id: userId});
    if (user.admin) {
      this.redisQueue.remove(userId, 'admin');
    } else {
      this.redisQueue.remove(userId, 'user');
      this.clearTimeout(userId);
    }
  }

  clearTimeout(userId) {
		if (this.timeoutMap.indexOf(userId) === -1) {
			//TODO sent redis message to timeout user
			redisCall((r) => {
				r.publish('timeouts', userId, (err, reply) => {
          if (!!err) {
            console.error("publish error", err);
          } else {
            console.log("publish reply", reply);
          }
        });
			});
		}	else {
      console.log("clearing timeout on this server");
    	let timeout = this.timeoutMap.get(userId).timeout;
     	Meteor.clearTimeout(timeout);  
      this.timeoutMap.remove(userId);  
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
    
    console.log("making room", convoId);
    
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

  addUserToRoom(convoId, userId, fromPublish) {

    convo = Convos.findOne({_id: convoId});
    user = Meteor.users.findOne({_id: userId});
    if ( !!convo && !!user && !user.in_convo) {
      console.log("adding user", userId, "to room", convoId);
      Meteor.users.update({_id: userId}, {
        $set: {in_convo: true, curConvo: convoId, rated: false}
      });

      Convos.update({_id: convoId}, {
        $push: {users: {id: userId, rated: 'none', isReady: false, englishCount: 0, markedOffTopic: false}},
        $inc: {curSessions: 1}
      });   
    
    } else if (!fromPublish) {
      redisCall((r) => {
				r.publish('addUserToRoom', userId + "," + convoId, (err, reply) => {
          if (!!err) {
            console.error("add user publish error", err);
          } else {
            console.log("add user publish reply", reply);
          }
        });
			});
    } else {
      console.log('invalid convoId or userId when trying to add user');
      console.log(convo);
      console.log(user);
      console.log(userId);
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

  add(userId, pool, callback) {
    if (pool === 'admin') {
      this.redisCall((r) => {
        r.sadd('adminSet', userId, (err, reply) => {
          if (!!err) {
            console.error(err); 
          } else {
            callback(reply);
          }
        });
      });
    } else if (pool == 'user') {
      this.redisCall((r) => {
        r.sadd('userSet', userId, (err, reply) => {
          if (!!err) {
            console.error(err);
          } else {
            callback(reply);
          }
        });
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
