import NavBar from '/imports/ui/components/NavBar.jsx'
import Screen from '/imports/ui/layouts/screen.jsx';
import React from 'react';
import { profanityRegex } from '/imports/ui/static/validationRegex.js';

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/chat',
    redirectTimeout: 4000,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
    onSubmitHook: (error, state) => {
      if(!error) {
        // if(state == "signIn") {
        //   console.log("successfully logged in");
        // }
      }
    }
});

AccountsTemplates.configure({
  defaultLayoutType: 'blaze-to-react',
  defaultTemplate: 'fullPageAtForm',  // default
  defaultLayout: Screen,
  defaultLayoutRegions: {
    nav: <NavBar/>,
  },
  defaultContentRegion: 'children'
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
      maxLength: 12,
      func: (username) => {
        return username.toLowerCase().search(profanityRegex) != -1;
      },
      errStr: "Please don't use profanity in your usernames"
  },
  pwd
]);
