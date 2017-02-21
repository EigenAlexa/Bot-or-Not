import mongo from 'meteor/mongo';

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
	},
  convoId: {
    type: String
  }
});

const Messages  = new Mongo.Collection("messages");
Messages.attachSchema(MessageSchema);
export { Messages };
