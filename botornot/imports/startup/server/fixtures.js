import { seedCollections } from "meteor/maxjohansen:collection-faker";
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';

const collectionsToSeed = [Convos, Messages];

seedCollections(collectionsToSeed, {
  numItemsPerCollection : 15,
});

console.log(Convos.find().fetch());
// console.log(Messages.find().fetch());
