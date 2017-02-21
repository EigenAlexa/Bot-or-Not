import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import Chat from '/imports/ui/components/Chat.jsx';
import { Messages } from '/imports/api/messages/messages.js';

export default ChatContainer = createContainer(({ params: { id } }) => {
    const roomHandle = Meteor.subscribe('chat', id.roomId);
    const msgHandle = Meteor.subscribe('msgs', id.roomId);
    const userHandle = Meteor.subscribe('currentUsers', id.roomId);
    const loading = !roomHandle.ready() || !msgHandle.ready() || !userHandle.ready();
    const room = Convos.findOne({_id: id.roomId});
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
