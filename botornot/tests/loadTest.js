
meteorDown.init(function (Meteor) {
  //Meteor.call('convos.updateChat', "hi there", "rASEfCG92mMXww89R", "sneRbex8RRqpPPbdT", function (error, result) {
  //  Meteor.kill();
  //});
  Meteor.subscribe('currentUsers', "rASEfCG92mMXww89R", function() {
    Meteor.kill();
  });
});

meteorDown.run({
  concurrency: 100,
  url: "http://beta.botornot.ml"
});
