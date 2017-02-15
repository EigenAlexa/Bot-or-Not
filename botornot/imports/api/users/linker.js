import { Convos } from '../convos/convos.js';

Meteor.users.addLinks({
    convos : {
        collection: Convos,
        inversedBy: 'users',
    },
    partners : {
        collection: Meteor.users,
        type: 'many',
        autoremove: false,
    }
});
