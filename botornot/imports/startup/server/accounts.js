import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
// TODO schedule for deletion. Only used for debugging.
Accounts.onCreateUser(function (options, user) {
    // if facebook user, get their profile picture
    //
    console.log('opts', options)
    if ('services' in user && 'facebook' in user.services) {
        let profUrl ='http://graph.facebook.com/' + user.services.facebook.id + '/picture'; 
        user.profPic = profUrl;
        // go to the username creation page
        
    }
    console.log('post-login', user);
    
    return user;
})
