var RedisCluster = require('redis-cluster').clusterClient;

redisCall = (func) => {
  new RedisCluster.clusterInstance(Meteor.settings.redisHost + ":" + Meteor.settings.redisPort, (err, r) => {
    if (!!err) {
      console.log(err);
    }
    func(r);
  });
};

export { redisCall };
