import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Convos } from '/imports/api/convos/convos.js';

import WaitPage from '../pages/WaitPage.jsx';

export default ChatContainer = createContainer(() => {
    const roomsHandle = Meteor.subscribe('openrooms');

    return {
        openRooms: Convos.find({}).fetch(),
        loading: !roomsHandle.ready(),
        connected : Meteor.status().connected,
	};
}, WaitPage);
