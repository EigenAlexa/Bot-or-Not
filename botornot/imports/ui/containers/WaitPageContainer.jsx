import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import WaitPage from '../pages/WaitPage.jsx';
import React from 'react';
//import { ReactLayout } from 'meteor/kadira:react-layout';
import ReactDOM from 'react-dom';
import ClosedPageContainer from '/imports/ui/containers/ClosedPageContainer.jsx';
import Screen from '/imports/ui/layouts/screen.jsx';

export default WaitContainer = createContainer(() => {
    const roomsHandle = Meteor.subscribe('openrooms');
    const userHandle = Meteor.subscribe('currentUser', Meteor.userId());
    console.log('userhandle', userHandle.ready());
    console.log('curuserid', Meteor.userId());
    const userCursor = Meteor.users.find({_id: Meteor.userId()});
    const user = Meteor.users.findOne({_id: Meteor.userId()});
    return {
      openRooms: Convos.find({curSessions: {$lt: 2}, closed: false}).fetch(),
      loading: !roomsHandle.ready() || !userHandle.ready(),
      connected : Meteor.status().connected,
      user: user 
	};
}, WaitPage);
