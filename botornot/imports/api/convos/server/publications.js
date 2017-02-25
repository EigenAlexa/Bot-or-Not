import { Convos } from '../convos.js';
import { Meteor } from 'meteor/meteor';

Meteor.publish('chat', (roomId) => {
    return Convos.find({
        _id: roomId,
    });
});

function getUserId(userName) {
    let user = Meteor.users.findOne({'username' : userName});
    return !!user ? user._id: user;
}
function getConvos(userId, bot) {
    cursor = Convos.find({'users.id': userId, 'users.ratedBot' : bot}, {
        sort : {time : -1},
        limit: 5,
        fields : {
            _id : 1,
            time : 1,
            'users.ratedBot' : 1,
        },
        users : {$elemMatch : {'id' : userId}}
    });
    console.log(cursor.fetch());
    return cursor;
}

// published all convos where user is rated bot
Meteor.publish('userNotConvos', (userName) => {
    // get user id from username
    let userId = getUserId(userName);
    console.log('userid for ', userName, userId);
    // return all conversations relevant to that userid
    return getConvos(userId, false);
});

Meteor.publish('userBotConvos', (userName) => {
    // get user id from username
    let userId = getUserId(userName);
    // return all conversations relevant to that userid
    return getConvos(userId, true);
});

// returns details about the open rooms
Meteor.publish('openrooms', () => {
    return Convos.find({
        curSessions : {$lt : 2},
        closed : false
    }, { fields :{
        curSessions: 1,
        closed : 1,
    }});
});

Convos.find({closed: false}).observe({
      changed: (newConvo, oldConvo) => {
        console.log('convo changed', newConvo.turns);
        if(newConvo.turns > 2){
          console.log("finishing convos");
          Meteor.call('convos.finishConvo', newConvo._id);
          Meteor.call('convos.finishConvoUsers', newConvo._id);
        }
      } 
    });
