import { Convos } from '../convos.js'

Meteor.publish('room', (roomId) => {
    return Convos.find({
        _id: roomId,
    }, { fields: {
        curSessions : 1,
        closed : 1
    }});
});

Meteor.publish('openrooms', () => {
    return Convos.find({
        curSessions : {$lt : 2},
        closed : false
    }, { fields :{
        curSessions: 1,
        closed : 1
    }});
});
