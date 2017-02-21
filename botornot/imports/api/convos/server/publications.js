import { Convos } from '../convos.js'

Meteor.publish('chat', (roomId) => {
    return Convos.find({
        _id: roomId,
    });
});

Meteor.publish('openrooms', () => {
    return Convos.find({
        curSessions : {$lt : 2},
        closed : false
    }, { fields :{
        curSessions: 1,
        closed : 1,
		messageId: 1,
    }});
});
