import { HTTP } from 'meteor/http';
import { Convos } from '/imports/api/convos/convos.js';

Meteor.methods({ 'startBot'(roomId) {
  startBot(roomId);
}});

function startBot(roomId) { 
  console.log(roomId, 'roomId');
  convo = Convos.findOne({'_id' : roomId})
  console.log('starting bot', convo);
  
  if (!!convo && convo['curSessions'] < 2) {
    let bot_url;

    // TODO move to some startup script that also checks whether botServer is running
    if (!!Meteor.settings.botServerUrl) {
      bot_url = Meteor.settings.botServerUrl;
    } else {
      throw new Error('Bot Server URL not in settings');
    }
    if (!!Meteor.settings.serverUrl) {
      server_url = Meteor.settings.serverUrl;
    } else {
      throw new Error('Meteior server URL not in settings');
    }

    // send post request to bot_url with url
    try {
      let response = HTTP.post(bot_url, {
        data : {'server_url' : server_url, 
        'room_id' : roomId}
      }).data;
    } catch(error) {
      // TODO add handling that would send us an email or something
      console.log('error: ', error);
    }
  } 
    
}

export {startBot};
