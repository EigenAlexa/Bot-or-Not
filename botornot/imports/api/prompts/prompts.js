import { Meteor } from 'meteor/meteor';
import mongo from 'meteor/mongo';

PromptSchema = new SimpleSchema({
  text: {
    type: String,
    label: "text",
  },
});

const Prompts = new Mongo.Collection("prompts");
Prompts.attachSchema(PromptSchema);

export { Prompts };
