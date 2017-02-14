import { Meteor } from 'meteor/meteor';

// Deny all client-side updates to user documents
// Security measure
Meteor.users.deny({
  update() { return true; }
});
