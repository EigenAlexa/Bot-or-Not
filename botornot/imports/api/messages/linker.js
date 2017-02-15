import { Messages } from './messages.js'
import { Convos } from '../convos/convos.js'

Messages.addLinks({
    convos: {
        collection: Convos,
        inversedBy: 'messages'
    }
});
