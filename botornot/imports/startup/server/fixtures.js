import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Debug } from '/imports/startup/both/debug.js';
import PromptList from '/imports/ui/static/prompt-list.jsx';

const collectionsToSeed = [Messages];
Meteor.startup(() => {
    if (Debug.resetDb()) {
      Messages.remove({});
      Convos.remove({});
      Meteor.users.find().forEach( (user) => {
        console.log(Meteor.users.update({_id: user._id}, {$set:{in_convo: false}}));
      });    
    }

  /**  seedCollections(collectionsToSeed, {
      numItemsPerCollection : 15,
    }); **/

    PromptList.forEach((promp)=> {
      Prompts.upsert({'text': promp}, { $setOnInsert : {'text': promp}});
    });
});
