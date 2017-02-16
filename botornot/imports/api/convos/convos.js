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
    },
    closed: {
        type: Boolean,
        label: 'closed',
        defaultValue: false,
    },
    curSessions: {
        type: Number,
        label: 'curSessions',
        defaultValue: 0,
    }
});

const Convos = new Mongo.Collection("conversations");
Convos.attachSchema(ConvoSchema);

Convos.helpers({
    messages() {
        const messagesLink = Convos.getLink(this._id, 'messages');
        return messagesLink.find({sort: {time : -1}});
    }
});

export { Convos };
