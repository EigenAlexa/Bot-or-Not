import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Prompts } from '/imports/api/prompts/prompts.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Debug } from '/imports/startup/both/debug.js';

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

    if (Prompts.find().count() == 0) {
      Prompts.insert({'text': 'Is trump a gump?'});
    }


});
Debug.log(Convos.find().fetch());
