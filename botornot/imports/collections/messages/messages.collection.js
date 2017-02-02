import React, { Component } from 'react';
import mongo from 'meteor/mongo';
import 'react-bootstrap';
import UserSchema from '/imports/collections/users/users.collection.js'

export const messages = new Mongo.Collection("messages");

MessageSchema = new SimpleSchema({
	user: {
		type: String,
		label: "user"
	},
	message: {
		type: String,
		defaultValue: ""
	}
});
/*
<template name="insertBookForm">
  {{> quickForm collection="Books" id="insertBookForm" type="insert"}}
</template>
*/
ConvoSchema = new SimpleSchema({
	idNumber: {
		type: Number,
		label: "idNumber",
		defaultValue: 0
	},
	user1: {
		type: UserSchema, 
		label: "user1",
		defaultValue: ""
	},
	user2: {
		type: UserSchema,
		label: "user2",
		defaultValue: ""
	},
	length: {
		type: Number, 
		label: "length",
		defaultValue: 0
	},
	messages: {
		type: [MessageSchema],
		label: "messages",
		defaultValue: [""]
	}
});

messages.attachSchema(MessageSchema);

export class Messages extends Component {
	render() {
		return {
		}
	}
}