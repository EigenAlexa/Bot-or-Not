import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Bugs } from '/imports/api/bugs/bugs.js';
// import AutoForm from 'meteor/aldeed:autoform';

export default class BugReport extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.submitHook, 'submitHook');
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
    console.log(formOptions);
    return blazeToReact('quickForm')(formOptions);
  }
}

