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
    console.log('getting convos', Convos.find(
        {'users.id' : userId, 'users.rated': bot},
        {fields: { _id : 1, time: 1}}).fetch());
    cursor = Convos.find({'users.id' : userId, 'users.rated': bot}, {
        sort : {time : -1},
        limit : 5,
        fields: {
            _id : 1,
            time : 1,
            'users' : {$elemMatch: {'id' : userId}}
        }
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
    return getConvos(userId, 'not');
});

Meteor.publish('userBotConvos', (userName) => {
    // get user id from username
    let userId = getUserId(userName);
    // return all conversations relevant to that userid
    return getConvos(userId, 'bot');
});

// returns details about the open rooms
Meteor.publish('openrooms', () => {
    return Convos.find({
        curSessions : {$lt : 2},
        closed : false,
        hostID: Meteor.settings.hostID,
    }, { fields :{
        curSessions: 1,
        closed : 1,
        hostID: 1,
    }});
});
