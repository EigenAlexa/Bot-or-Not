import { Convos } from '../convos.js'

Meteor.publish('chat', (roomId) => {
    return Convos.find({
        _id: roomId,
    });
});

Meteor.publish('openrooms', () => {
    return Convos.find({
        curSessions : {$lt : 2},
        closed : false
    }, { fields :{
        curSessions: 1,
        closed : 1,
    }});
});
Convos.find({closed: false}).observe({
      changed: (newConvo, oldConvo) => {
        console.log('convo changed', newConvo.turns);
        if(newConvo.turns > 2){
          console.log("finishing convos");
          Meteor.call('convos.finishConvo', newConvo._id);
          Meteor.call('convos.finishConvoUsers', newConvo._id);
        }
      } 
    });
