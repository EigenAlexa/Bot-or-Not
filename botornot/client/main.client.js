import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';


import '/imports/ui/routes.js';


Meteor.startup(function() {
	FlowRouter.initialize();
    // render(renderRoutes(), document.getElementById('app'));
});

Meteor.subscribe("leaderboard");
Meteor.subscribe("conversations");



// need to get autoform running
// need to be able to load layouts onto screenmanager without window exception
