import React, { PropTypes } from 'react'
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import {VelocityComponent} from 'velocity-react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';


export let Layout = null;

class ScreenManager extends React.Component {
  constructor() {
    super();
    Layout = this;
  }

  transitionTo(newScreen) {
    this.setState({
      currentScreen: newScreen
    });
  }

  currentScreenDidMount() {
    // stub
  }

  componentWillMount() {
    FlowRouter.initialize();
  }

  render () {
    return (
      <div>
        {this.state.currentScreen}
      </div>
    )
  }
}

mount(ScreenManager);