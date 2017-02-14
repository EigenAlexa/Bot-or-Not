import React, { Component } from 'react';
import mongo from 'meteor/mongo';
import 'react-bootstrap';

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
	user1: {
		type: String, // user id
		label: "user1",
		defaultValue: ""
	},
	user2: {
		type: String, // user id
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
	}
});

const Messages  = new Mongo.Collection("messages");
Messages.attachSchema(MessageSchema);
const Convos = new Mongo.Collection("conversations");
Convos.attachSchema(ConvoSchema);
export default Convos;
