var RedisCluster = require('redis-cluster').clusterClient;

redisCall = (func) => {
  new RedisCluster.clusterInstance(Meteor.settings.redisHost + ":" + Meteor.settings.redisPort, (err, r) => {
    if (!!err) {
      console.log(err);
    }
    func(r);
  });
};

pubSub = (func, onMessage) => {
  new RedisCluster.clusterInstance(Meteor.settings.redisHost + ":" + Meteor.settings.redisPort, (err, r) => {
    if (!!err) {
      console.error(err);
    }
    func(r);
    RedisCluster.redisLinks[0].link.on('message', onMessage);
  });

};

export { redisCall, pubSub };
