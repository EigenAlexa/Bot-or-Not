import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Convos } from '/imports/api/convos/convos.js';

import Chat from '/imports/ui/components/Chat.jsx';
import { Messages } from '/imports/api/messages/messages.js';

export default ChatContainer = createContainer(({ params: { id } }) => {
    const roomHandle = Meteor.subscribe('chat', id.room);
    const msgHandle = Meteor.subscribe('msgs', id.room);
    const room = Convos.findOne({_id: id.room});
    const userHandle = Meteor.subscribe('currentUsers', id.room);
    const loading = !roomHandle.ready() || !msgHandle.ready() || !userHandle.ready();
    const roomExists = !loading && !!room;
    const connected = Meteor.status().connected;
    return {
        room,
        loading,
        roomExists,
        connected,
        messages : roomExists ? room.messages() : [],
	};
}, Chat);
