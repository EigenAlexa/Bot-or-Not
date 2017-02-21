import {Meteor} from 'meteor/meteor';
import mongo from 'meteor/mongo';
import { Messages } from '../messages/messages.js'
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
    },
  msgs: {
    type: [String],
    label: 'msgs',
    defaultValue: [],
    minCount: 0
  },
  users: {
    type: [String],
    label: 'users',
    defaultValue: [],
    minCount: 0
  },
});

const Convos = new Mongo.Collection("convos");
Convos.attachSchema(ConvoSchema);

Convos.helpers({
    messages() {
    if (!!this.msgs){
		  const messages = Messages.find({convoId: this._id}).fetch();
		  return messages;
    }else{
      return [];
    }
        // TODO fix the grapher bullshit
		// const messagesLink = Convos.getLink(this._id, 'messages');
        // return messagesLink.find({sort: {time : -1}});
    }
});
export { Convos };
