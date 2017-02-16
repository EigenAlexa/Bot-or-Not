import { Convos } from '../convos.js'

Meteor.publish('room', (roomId) => {
    return Convos.find({
        _id: roomId,
    });
});