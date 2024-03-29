import { HTTP } from 'meteor/http';
import { Convos } from '/imports/api/convos/convos.js';
import { exitConvo } from '/imports/api/users/methods.js';
//Meteor.methods({ 'startBot'(roomId) {
//  startBot(roomId);
//}});

startBot = (roomId, userId) => { 
  console.log('roomId',roomId);
  convo = Convos.findOne({'_id' : roomId})
  console.log('starting bot in convo', roomId);
  bot_convos = Convos.find({_id: {$ne: roomId},
                            hasBot: true,
                            closed: false})
                          .fetch();
    // check to make sure that convos has more htan one user
  // mainly for debugging 
  console.log("Bot_convos", bot_convos);
  if (!!bot_convos && bot_convos.length >= 1) {
    bot_convo = bot_convos[0];
    console.log('bot_convo', bot_convo);
    //kick bot from other bot convo
    bot_convo.users.forEach((user) => {
      if (user.bot)
        exitConvo(user.id);
    });
    convo.users.forEach((user) => {
      if (user.bot)
        exitConvo(user.id);
    });
    //Meteor.call('convos.finishConvoUserLeft', bot_convo._id);
    //Meteor.call('convos.finishConvo', bot_convo._id);
    //finish this convo as well
    //Meteor.call('convos.finishConvoUserLeft', convo._id);
    //Meteor.call('convos.finishConvo', convo._id);

    return false;
  } else if (!!convo && convo['curSessions'] < 2) {
    let bot_url;

    // TODO move to some startup script that also checks whether botServer is running
    if (!!Meteor.settings.botServerUrl) {
      bot_url = Meteor.settings.botServerUrl;
    } else {
      throw new Error('Bot Server URL not in settings');
    }
    if (!!process.env.SERVER_HOST && !!process.env.SERVER_PORT) {
      server_url = process.env.SERVER_HOST + ":" + process.env.SERVER_PORT;
    } else if (!!Meteor.settings.serverUrl) {
      server_url = Meteor.settings.serverUrl;
    } else if (!!process.env.PORT) {
      server_url = "127.0.0.1:" + process.env.PORT;
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
          'max_turns' : maxTurns,
          'other_user' : userId
        }
      }).data;
      // flag the room as containing a bot
      Convos.update({'_id' : roomId}, {$set: {'hasBot' : true}});
      return true;
    } catch(error) {
      // TODO add handling that would send us an email or something
      console.log('error: ', error);
    }
  } 
    
}

export {startBot};
