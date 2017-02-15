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
	}
});

const Messages  = new Mongo.Collection("messages");
Messages.attachSchema(MessageSchema);
export { Messages };
