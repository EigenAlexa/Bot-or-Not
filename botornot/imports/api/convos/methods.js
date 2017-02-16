import { Convos } from './convos.js';

export const getOpenRooms = () => {
    // get all convos that have less than two people and aren't closed yet
    // filter all room.curssions < 2 and closed = false
    return [];
}
export const makeNewRoom = () => {
    // makes a new convo and returns the roomId
    //
    return 0;
}

export const addToRoom = (sessionId, roomId) => {
    // adds a session to the room with the id
    // if room.cursessions >= 2 after add, then set closed = true 
    // subscribes the current user to the room object
}

export const readyTochat = (roomId) => {
    // returns a boolean of whether the room has 2 sessions and is 
    // ready to go 
}
