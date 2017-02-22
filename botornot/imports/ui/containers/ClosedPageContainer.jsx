import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import ClosedPage from '../pages/ClosedPage.jsx';

export default ClosedContainer = createContainer(({ params }) => {
  const { roomId, userLeft } = params;  
  const roomHandle = Meteor.subscribe('chat', roomId);
  const usersHandle = Meteor.subscribe('currentUsers', roomId);
  console.log(roomId, !!userLeft);
  return {
    room: Convos.findOne({_id: roomId}),
    loading: !roomHandle.ready() || !usersHandle.ready(),
    connected: Meteor.status().connected,
    userLeft: userLeft == "true"
  };
}, ClosedPage);
