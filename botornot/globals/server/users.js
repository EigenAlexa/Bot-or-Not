import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function(options, user){
    // user.convos = [];
    // user.given_ratings = [];
    // user.self_ratings = [];
    // uesr.violations = 0;
    
    console.log(user);
    return user;
});
// Deny all client-side updates to user documents
// Security measure
Meteor.users.deny({
  update() { return true; }
});
