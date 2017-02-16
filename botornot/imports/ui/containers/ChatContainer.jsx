import { Meteor } from 'meteor/meteor';
import { Lists } from '/imports/api/convos/convos.js';
import { createContainer } from 'meteor/react-meteor-data';
import ChatPage from '../pages/ChatPage.jsx';

export default ChatContainer = createContainer(({ params }) => {
	const { id } = params;
	const roomHandle = Meteor.subscribe('room', id);
	const loading = !roomHandle.ready();
	const convo = Convos.findOne(id);
	const convoExists= !loading && !!list;
	return {
		loading,
		convo,
		convoExists,
	};
}, ChatPage);
