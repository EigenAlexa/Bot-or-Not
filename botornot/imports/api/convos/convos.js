import mongo from 'meteor/mongo';

ConvoSchema = new SimpleSchema({
	length: {
		type: Number,
		label: "length",
		defaultValue: 0
	},
    botnot1: {
        type: Boolean,
        label: 'botnot1',
        optional: true,
    },
    botnot2: {
        type: Boolean,
        label: 'botnot2',
        optional: true,
    }
});

const Convos = new Mongo.Collection("conversations");
Convos.attachSchema(ConvoSchema);

export { Convos };
