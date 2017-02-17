import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Debug } from '/imports/startup/server/debug.js';

const collectionsToSeed = [Convos, Messages];

seedCollections(collectionsToSeed, {
  numItemsPerCollection : 15,
});

Debug.log(Convos.find().fetch());
// console.log(Messages.find().fetch());
