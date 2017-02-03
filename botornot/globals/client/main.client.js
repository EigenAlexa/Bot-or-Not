import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';
 
import Chat from '/imports/collections/messages/ui/Chat.jsx';
import Messages from '/imports/collections/messages/messages.collection.js';
import HomeScreen from '/imports/ui/screens/home.screen.jsx';

 
Meteor.startup(function() {
	render(
		<HomeScreen>
		</HomeScreen>,
  		document.getElementById('screencomponent'));
});



FlowRouter.route('/', {
  name: 'test',
  action() {
    	console.log("tested");
  }
}); 

function makeNewUser() {
	
}
