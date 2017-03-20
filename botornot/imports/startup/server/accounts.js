import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';
// TODO schedule for deletion. Only used for debugging.
Accounts.onCreateUser(function (options, user) {
    // if facebook user, get their profile picture
    //
  userId = Meteor.userId();
  console.log(userId);
  anon = Meteor.users.findOne({_id: userId});
  if (!!userId && userId != user._id && !!anon && anon.anon )  {
    //doc._id = userId;
    let keepProps = ['sessions',
                       'notratings',
                       'prob',
                       'rating',
                       'badges',
                       'profPic',
                       ];
    keepProps.forEach((prop) => {
      user[prop] = anon[prop];
    });
    SyncedCron.add({
      name: "switching anon to real: " + userId,
      // wait for 1 second before switching everything on the backend
      schedule: (parser) => {
        let time = new Date(Date.now() + 1000);
        console.log(time);
        return parser.recur().on(time).fullDate();
      },
      job: () => {
        Convos.find({"users.id": userId}).forEach((doc) => {
          Convos.update({_id: doc._id, "users.id": userId}, {
            $set: {"users.$.id": user._id}
          });
        });
        Messages.find({user: userId}).forEach((doc) => {
          Messages.update({_id: doc._id, user: userId}, {
            $set: {user: user._id}
          });
        });
        Meteor.users.remove({_id: userId});
      },
    });
    //Meteor.users.remove({_id: userId}, (error, result) => {
      //console.log("removed");
      //Meteor.users.insert(doc);
    //});
  }
 //   if (!!Meteor.userId()) {
 //       anonUserId = Meteor.userId();
 //       realUserId = user._id;
 //       console.log("moving anon to new user");
 //       anon = Meteor.users.findOne({_id: anonUserId});
 //       real = user; 
 //     //check that both user objects exist and that anon is anonymous user and real is not
 //       console.log(!!real);
 //       console.log(!!anon);
 //       if(!!real && !!anon && anon.anon && !real.anon) {
 //         let keepProps = ['sessions',
 //                          'notratings',
 //                          'prob',
 //                          'rating',
 //                          'badges',
 //                          'profPic',
 //                          ];
 //         keepProps.forEach((prop) => {
 //           real[prop] = anon[prop];
 //         });
 //         console.log("real: ", real);

 //         console.log("anonId: ", anonUserId);
 //         console.log(Meteor.users.findOne({_id: anonUserId}));
 //       }
 //     user = real;
 //   }
    if ('services' in user && 'facebook' in user.services) {
        let profUrl ='http://graph.facebook.com/' + user.services.facebook.id + '/picture'; 
        user.profPic = profUrl;
        // go to the username creation page
        
    }
    
    return user;
})
