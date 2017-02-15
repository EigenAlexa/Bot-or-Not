import { Ratings } from './ratings.js';
import { Convos } from '../convos/convos.js';

Ratings.addLinks({
    convos: {
        collection: Convos,
        inversedBy: 'ratings'
    },
});
