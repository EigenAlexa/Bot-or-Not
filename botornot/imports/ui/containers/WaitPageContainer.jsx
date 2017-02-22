import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import WaitPage from '../pages/WaitPage.jsx';

export default WaitContainer = createContainer(() => {
    const roomsHandle = Meteor.subscribe('openrooms');
    const userHandle = Meteor.subscribe('currentUser', Meteor.userId());
    const user = Meteor.users.findOne({_id: Meteor.userId()});
    console.log(user);
    return {
      openRooms: Convos.find({curSessions: {$lt: 2}, closed: false}).fetch(),
      loading: !roomsHandle.ready() || !userHandle.ready(),
      connected : Meteor.status().connected,
      user: user 
	};
}, WaitPage);
