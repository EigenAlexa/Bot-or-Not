import {Meteor} from 'meteor/meteor';
import mongo from 'meteor/mongo';

BugSchema = new SimpleSchema({
  email: {
    type: String,
    label: 'Email',
  },
  description: {
    type: String,
    label : 'Description',
  },
  page: {
    type: String, 
    label: 'Page',
  }
});
const Bugs = new Mongo.Collection("bugs");
Bugs.attachSchema(BugSchema);

export { Bugs };
