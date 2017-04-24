 import { RedisOplog } from 'meteor/cultofcoders:redis-oplog'
RedisOplog.init({
    	"redis": {
      	"port": Meteor.settings.redisPort,          
      	"host": Meteor.settings.redisHost   
    	},
    	"mutationDefaults": {
        	"optimistic": false,
      	  "pushToRedis": true
    	},
    	"debug": false, 
    	"overridePublishFunction": true 
		}
);
 
