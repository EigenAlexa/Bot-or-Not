module.exports = {
  servers: { 
    'one':{
      host: "54.215.251.172",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
      opts: {
     //   CLUSTER_BALANCER_URL: "http://one.botornot.ml",
      }
      // password:
      // or leave blank for authenticate from ssh-agent
    },
    'two':{
      host: "52.53.198.198",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
        
    },
    'three':{
      host: "54.219.161.184",
      username: "ubuntu",
      pem: "~/.ssh/james_ncal.pem",
       
    }
  },
  meteor: {
    name: "meteor",
    path: "../",
    servers: {
      'one':{env:{CLUSTER_BALANCER_URL: "http://one.botornot.ml"}},
      'two': {env:{CLUSTER_BALANCER_URL: "http://two.botornot.ml"}},
      'three':{env:{ CLUSTER_BALANCER_URL: "http://three.botornot.ml"}},
    },  
    buildOptions: {
      serverOnly: true,
      debug: true
    },
    env: {
      ROOT_URL: "http://beta.botornot.ml",
      MONGO_URL: "mongodb://10.0.1.4:27017,10.0.1.25:27017,10.0.1.133:27017/meteor?replicaSet=rs0&readPreference=primaryPreferred&w=majority",
      CLUSTER_DISCOVERY_URL: "mongodb://10.0.1.4:27017,10.0.1.25:27017,10.0.1.133:27017/meteor?replicaSet=rs0&readPreference=primaryPreferred&w=majority",
      CLUSTER_WORKERS_COUNT: "auto",
      CLUSTER_SERVICE: "web",
//      DISABLE_WEBSOCKETS: "1",
    },

    // change to kadirahq/meteord if your app is not using Meteor 1.4
    docker: {
      image: "abernix/meteord:base",
      args: [
        '--network=host',
      ],
    },
    deployCheckWaitTime: 60,
    
    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },
};
