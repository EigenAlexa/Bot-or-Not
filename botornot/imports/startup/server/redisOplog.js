 import { RedisOplog } from 'meteor/cultofcoders:redis-oplog'
RedisOplog.init({
    	"redis": {
      	"port": 7000,          
      	"host": "127.0.0.1"   
    	},
    	"mutationDefaults": {
        	"optimistic": false,
      	  "pushToRedis": true
    	},
    	"debug": false, 
    	"overridePublishFunction": true 
		}
);
 
