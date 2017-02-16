import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// import methods from convos
import {
    getOpenRooms,
    makeNewRoom, 
    addToRoom
} from '/imports/api/convos/methods.js';

export const getSessionId = () => {
    return Meteor.connection._lastSessionId;
}

export const getARoom = () => {
    const openRooms = getOpenRooms();
    var roomId;
    if (openRooms.length > 1) {
        console.log('open a room');
        roomId = openRooms[0];
    } else {
        console.log('No room available - waiting for humans or bots to free up');
        roomId = makeNewRoom();
    }
    return roomId;
}
    
