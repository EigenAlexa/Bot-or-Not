import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Layout} from '/imports/ui/layout/layout'
import {mount} from 'react-mounter';

import HomeScreen from '/imports/ui/screens/home/home.screen'

FlowRouter.wait();

FlowRouter.route('/', {
  name: 'home',
  action(params, queryParams) {
    //referance a component instance, and call methods from this callback????
    Layout.transitionTo(<HomeScreen />);
  },
});