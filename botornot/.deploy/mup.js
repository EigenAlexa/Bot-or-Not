module.exports = {
  servers: {
    main: {
      host: '54.153.34.43',
      username: 'ubuntu',
      pem: '~/.ssh/james_ncal.pem',
    }
  },

  meteor: {
    name: 'botnotsb',
    path: '../',
    servers: {
      main: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://54.153.34.43/',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60,
    
    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: false
  },

  mongo: {
    oplog: true,
    port: 27017,
    version: '3.4.1',
    servers: {
      main: {},
    },
  },
};
