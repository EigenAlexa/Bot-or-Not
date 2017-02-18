import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Debug } from '/imports/startup/both/debug.js';

const collectionsToSeed = [Messages];
Meteor.startup(() => {
    seedCollections(collectionsToSeed, {
      numItemsPerCollection : 15,
    });

    if (Convos.find().count() === 0) {
        const data = [
            {
                length : 0,
                botnot1: false,
                botnot2: false,
                closed: false,
                curSessions: 1
            },
            {
                length: 10,
                botnot1: false,
                botnot2: false,
                closed: true, 
                curSessions: 2
            },
        ];
        
        data.forEach((conv) => {
            const convoId = Convos.insert({
                length : conv.length,
                botnot1: conv.botnot1,
                botnot2: conv.botnot2,
                closed: conv.closed,
                curSessions: conv.curSessions,
            });
        });
    } else {
        console.log('Convos already populated, skipping');
    }
});
Debug.log(Convos.find().fetch());
Debug.log(Convos.find({

        closed: false,
        curSessions : {$lt: 2}
    }).fetch());
// Debug.log(Messages.find().fetch());
