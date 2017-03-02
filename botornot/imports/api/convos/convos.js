import {Meteor} from 'meteor/meteor';
import mongo from 'meteor/mongo';
import { Messages } from '../messages/messages.js'

UserSchema = new SimpleSchema({
  id: {
    type: String,
    label: "id",
    defaultValue: "",
  },
  ratedBot: {
    type: Boolean,
    label: "ratedBot",
    defaultValue: false,
  },
  isReady: {
    type: Boolean,
    label: "isReady",
    defaultValue: false
  },
  englishCount: {
    type: Number,
    label: "englishCount",
    defaultValue: 0
  }
});

ConvoSchema = new SimpleSchema({
	length: {
		type: Number,
		label: "length",
		defaultValue: 0
	},
  turns: {
    type: Number,
    label: "turns",
    defaultValue: 0
  },
  max_turns: {
    type: Number, 
    label: "max_turns",
    defaultValue: !!Meteor.settings.maxTurns ? Meteor.settings.maxTurns : 3 
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
    type: [UserSchema],
    label: 'users',
    defaultValue: [],
    minCount: 0
  },
  time: { 
    type: Date, 
    label: 'time',
  },
/*  promptText: {
    type: String,
    label: 'promptId',
  },*/
  canRate: {
    type: Boolean,
    label: 'canRate',
    defaultValue: false
  },
  hostID: {
    type: String,
    label: 'hostID',
    defaultValue: ""
  }
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

Convos.after.update( (userId, doc, fieldNames, modifier, options) => {
  turnsUpdate = fieldNames.indexOf('turns') > -1;
  if (turnsUpdate && doc.turns >= doc.max_turns){
    Convos.update({_id: doc._id}, {
      $set: {canRate: true}
    });
  }


});

export { Convos };
