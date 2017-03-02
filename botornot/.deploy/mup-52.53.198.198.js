module.exports = {
  servers: { 
    'one':{
      host: "52.53.198.198",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
      // password:
      // or leave blank for authenticate from ssh-agent
    },
  /*  'two':{
      host: "52.53.198.198",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
        
    },
    'three':{
      host: "54.219.161.184",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
       
    }*/
  },
  meteor: {
    name: "meteor",
    path: "../",
    servers: {
      'one':{},//{env:{CLUSTER_BALANCER_URL: "http://one.botornot.ml", CLUSTER_ENDPOINT_URL: "52.215.251.172: "}},
      //'two':{},// {env:{}}//{CLUSTER_BALANCER_URL: "http://two.botornot.ml"}},
      //'three':{env:{ CLUSTER_BALANCER_URL: "http://three.botornot.ml"}},
    },  
    buildOptions: {
      serverOnly: true,
      debug: true
    },
    env: {
      ROOT_URL: "http://beta.botornot.ml",
      MONGO_URL: "mongodb://10.0.1.4:27017,10.0.1.25:27017,10.0.1.133:27017/meteor?replicaSet=rs0&readPreference=primaryPreferred&w=1",
      CLUSTER_DISCOVERY_URL: "mongodb://172.17.0.2/meteor",
      CLUSTER_WORKERS_COUNT: "auto",
      CLUSTER_SERVICE: "web",
//      DISABLE_WEBSOCKETS: "1",
    },

    // change to kadirahq/meteord if your app is not using Meteor 1.4
    dockerImage: "abernix/meteord:base",
    deployCheckWaitTime: 60,
    
    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },
	mongo: { // (optional)
    oplog: true,
    port: 27017,
    version: '3.4.1', // (optional), default is 3.4.1
    servers: {
      one: {},
    },
  },
};
