import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';

Meteor.publishComposite('currentPrompt', (convoId) => {
  
  return {
    find() {
      return Convos.find({_id: convoId});
    },
    children: [{
      find(convo) {
        promptId = convo.promptId;
        console.log(promptId);
        console.log("prompt", Prompts.findOne({_id: promptId}));
        return Prompts.find({_id: promptId});
      }
    }]
  };

});
