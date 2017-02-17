import { Convos } from '../convos.js'

Meteor.publish('room', (roomId) => {
    return Convos.find({
        _id: roomId,
    }, { fields: {
        curSessions : 1,
        closed : 1
    }});
});
