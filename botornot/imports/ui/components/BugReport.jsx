/*
 * Manages the BugReport layout in the modal.
 * Author : Phillip Kuznetsov
 */
import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Bugs } from '/imports/api/bugs/bugs.js';
// import AutoForm from 'meteor/aldeed:autoform';

export default class BugReport extends React.Component {
  constructor(props) {
    super(props);
    const onSuccessWrapper = () => {
      let submitHook = this.props.submitHook;
      return function(f, r) {
        if (!!submitHook) {
          submitHook();
        }
      }
      
    };
    let hookObject = {
      onSuccess: onSuccessWrapper(),
    };
    
    AutoForm.addHooks('submitBug', hookObject, true);
  }

  getCurrentRoute() {
    return FlowRouter.current().path;
  }

  render() {
    window.Bugs = Bugs;
    let formOptions = {
      collection : "Bugs",
      id : "submitBug",
      type : "insert",
    };
    return blazeToReact('quickForm')(formOptions);
  }
}

