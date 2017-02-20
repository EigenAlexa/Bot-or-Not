import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import Chat from '/imports/ui/components/Chat.jsx';

export default ChatContainer = createContainer(({ params: { id } }) => {
    const roomHandle = Meteor.subscribe('chat', { roomId : id });
    const loading = !roomHandle.ready();
    const room = Convos.findOne();
    const roomExists = !loading && !!room;
    const connected = Meteor.status().connected;
    return {
        room,
        loading,
        roomExists,
        connected,
        messages : roomExists ? room.messages().fetch() : [],
	};
}, Chat);
