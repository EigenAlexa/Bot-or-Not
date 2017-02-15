import mongo from 'meteor/mongo';

ConvoSchema = new SimpleSchema({
	length: {
		type: Number,
		label: "length",
		defaultValue: 0
	},
});

const Convos = new Mongo.Collection("conversations");
Convos.attachSchema(ConvoSchema);

export { Convos };
