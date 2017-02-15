import mongo from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

ConvoSchema = new SimpleSchema({
	length: {
		type: Number,
		label: "length",
		defaultValue: 0
	},
});

const Convos = new Mongo.Collection("conversations");
Convos.attachSchema(ConvoSchema);

Convos.addLinks({
    messages: {
        type: 'many',
        collection: Messages,
        field: 'messageId', // optional, it generates a unique one
     //   metadata: {}, // optional, use it for meta relationships
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
        unique: true // optional, if you want a one-to-one kind of relationship
    },
    users: {
        type: 'many',
        collection: Meteor.users,
        field: 'messageId', // optional, it generates a unique one
        // metadata: {}, // optional, use it for meta relationships
        index: true, // optional, if set to true will create indexes for the links
        autoremove: false, // if set to true it will remove the linked objects from database
        unique: true // optional, if you want a one-to-one kind of relationship
    }
});

export { Convos };
