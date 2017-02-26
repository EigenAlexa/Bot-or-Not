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

    if (Convos.find().count() === 0) {
        const data = [
            {
                length : 0,
                botnot1: false,
                botnot2: false,
                closed: false,
                curSessions: 0,
            },
            {
                length: 2,
                botnot1: false,
                botnot2: false,
                closed: true, 
                curSessions: 2,
            },
        ];
        var convoIds = []; 
        data.forEach((conv) => {
            promptText = Prompts.aggregate([ { $sample: {size: 1}}])[0].text;
            console.log(promptText);
            const convoId = Convos.insert({
                length : conv.length,
                botnot1: conv.botnot1,
                botnot2: conv.botnot2,
                closed: conv.closed,
                curSessions: conv.curSessions,
                msgs: [],
                time: Date.now(),
                promptText: promptText,
            });
            convoIds.push(convoId);
            //const msgLinks = Convos.getLink(convoId, 'messages');
            //msgLinks.add(conv.msg);
        });

      const msgs = [
        {
          user: "james",
          message: "hello",
          convoId: convoIds[1], 
        },
        {
          user: "will",
          message: "dick balls",
          convoId: convoIds[1],
        }
      ];
      msgs.forEach((msg) => {
        const msgId = Messages.insert({
          user: msg.user,
          message: msg.message,
          time: Date.now(),
          convoId: msg.convoId
        });
        console.log(Convos.update({_id: msg.convoId}, {
          $push: {msgs: msgId}
        }));
      });
    } else {
        console.log('Convos already populated, skipping');
    }
});
Debug.log(Convos.find().fetch());
