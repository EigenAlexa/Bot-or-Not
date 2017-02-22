import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import WaitPage from '../pages/WaitPage.jsx';

export default WaitContainer = createContainer(() => {
    const roomsHandle = Meteor.subscribe('openrooms');
    const userHandle = Meteor.subscribe('currentUser', Meteor.userId());
    const userCursor = Meteor.users.find({_id: Meteor.userId()});
    userCursor.observe({
      changed: (newUser, oldUser) => {
        if (!newUser.in_convo && oldUser.in_convo){
          console.log("callback for user leaving: " + newUser._id);
          FlowRouter.go('closed', {}, {convoId: oldUser.curConvo, userLeft: newUser.left});
        }
      }
    });
    const user = Meteor.users.findOne({_id: Meteor.userId()});
    return {
      openRooms: Convos.find({curSessions: {$lt: 2}, closed: false}).fetch(),
      loading: !roomsHandle.ready() || !userHandle.ready(),
      connected : Meteor.status().connected,
      user: user 
	};
}, WaitPage);
