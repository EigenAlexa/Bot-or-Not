// import collections first
import '/imports/api/convos/convos.js';
import '/imports/api/messages/messages.js';
import '/imports/api/users/users.js';
import '/imports/api/ratings/ratings.js';
import '/imports/api/prompts/prompts.js';
import '/imports/api/bugs/bugs.js';

// then import links next
import '/imports/api/convos/linker.js';
import '/imports/api/messages/linker.js';
import '/imports/api/users/linker.js';
import '/imports/api/ratings/linker.js';
// now methods
import '/imports/api/convos/methods.js';
import '/imports/api/users/methods.js';
// finally publications
import '/imports/api/convos/server/publications.js';
import '/imports/api/users/server/publications.js';
import '/imports/api/messages/server/publications.js';
//import '/imports/api/prompts/server/publications.js';
