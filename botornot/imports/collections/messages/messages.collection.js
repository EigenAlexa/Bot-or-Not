import React, { Component } from 'react';
import mongo from 'meteor/mongo';
import 'react-bootstrap';
import UserSchema from '/imports/collections/users/users.collection.js'

MessageSchema = new SimpleSchema({
	user: {
		type: String,
		label: "user"
	},
	message: {
		type: String,
		defaultValue: ""
	},
	time: {
		type: Date
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
		type: String, // username 
		label: "user1",
		defaultValue: ""
	},
	user2: {
		type: String, // username
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

export const messages = new Mongo.Collection("messages").attachSchema(ConvoSchema);

export class Messages extends Component {
	render() {
		return {
		}
	}
}