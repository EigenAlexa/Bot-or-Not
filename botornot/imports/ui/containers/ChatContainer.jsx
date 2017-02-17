import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import ChatPage from '../pages/ChatPage.jsx';

export default ChatContainer = createContainer(({ params }) => {
	const { id } = params;
    const convo = Convos.findOne(id);
    const roomHandle = Meteor.subscribe('room', id);
	const loading = !roomHandle.ready();
	const convoExists= !loading && !!convo;
    const waiting = (! convoExists ) || roomHandle.curSessions < 2 || !roomHandle.closed;
    const messages = waiting? convo.messages().fetch() : [];
	
    return {
		convo,
        messages,
		waiting,
        loading,
		convoExists,
	};
}, ChatPage);
