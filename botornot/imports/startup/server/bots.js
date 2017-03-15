import { HTTP } from 'meteor/http';
import { Convos } from '/imports/api/convos/convos.js';

Meteor.methods({ 'startBot'(roomId) {
  startBot(roomId);
}});

function startBot(roomId) { 
  console.log(roomId, 'roomId');
  convo = Convos.findOne({'_id' : roomId})
  console.log('starting bot', convo);
  bot_convos = Convos.find({_id: {$ne: roomId},
                            hasBot: true,
                            closed: false}).fetch();
    // check to make sure that convos has more htan one user
  // mainly for debugging 
  if (convo.users.length == 0) {
    throw new Error('Convo has no users, not starting bot');
  } else if (!!bot_convos && bot_convos.length >= 1) {
    bot_convo = bot_convos[0];
    //kick bot from other bot convo
    Meteor.call('convos.finishConvoUserLeft', bot_convo._id);
    Meteor.call('convos.finishConvo', bot_convo._id);
    //finish this convo as well
    Meteor.call('convos.finishConvoUserLeft', convo._id);
    Meteor.call('convos.finishConvo', convo._id);
    return;
  } else if (!!convo && convo['curSessions'] < 2) {
    let bot_url;

    // TODO move to some startup script that also checks whether botServer is running
    if (!!Meteor.settings.botServerUrl) {
      bot_url = Meteor.settings.botServerUrl;
    } else {
      throw new Error('Bot Server URL not in settings');
    }
  
    if (!!Meteor.settings.serverUrl) {
      server_url = Meteor.settings.serverUrl;
    } else if (!!process.env.PORT) {
      server_url = "localhost:" + process.env.PORT;
    }else {
      console.log("ENV Variables: " , process.env);
      throw new Error('Meteior server URL not in settings');
    }

    let maxTurns;
    if (!!Meteor.settings.maxTurns) {
      maxTurns = Meteor.settings.maxTurns;
    }else {
      maxTurns = 10;
    }
    // send post request to bot_url with url
    try {
      let response = HTTP.post(bot_url + '/get-bot', {
        data : {
          'server_url' : server_url, 
          'room_id' : roomId, 
          'magic_phrase' : Meteor.settings.magicPhrase,
          'max_turns' : maxTurns
        }
      }).data;
      // flag the room as containing a bot
      Convos.update({'_id' : roomId}, {$set: {'hasBot' : true}});
    } catch(error) {
      // TODO add handling that would send us an email or something
      console.log('error: ', error);
    }
  } 
    
}

export {startBot};
