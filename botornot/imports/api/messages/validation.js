import { profanity, links, phones, emoticons } from '/imports/ui/static/validationRegex.js'; 
import emojiRegex from 'emoji-regex';
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Meteor } from 'meteor/meteor';
import typo from 'typo-js';
import aff from '/imports/ui/static/en_US.aff.js';
import dic from '/imports/ui/static/en_US.dic.js';

dict = new typo("en_US", aff, dic, {}); 

validate = (text, convoId, server) => {
    valid = true;
    errorMsgs = [];
    tests = [ {func: checkSwear, errorMsg: "Please don't use profanity in your messages."},
              {func: checkLinks, errorMsg: "Please don't put emails/links in your messages."},
              {func: checkPhone, errorMsg: "Please don't put phone numbers in your messages."},
              {func: checkEmojis, errorMsg: "Please don't put emojis in your messages."},
              {func: checkRepeated, errorMsg: "Please don't spam messages."},
              {func: checkEnglish, errorMsg: "We don't know what you're saying, please only type in English."},
            ] 
    tests.forEach((test) => {
      if(!test.func(text, convoId, server)){
        valid = false;
        errorMsgs.push(test.errorMsg);
      }
    });
    return {valid: valid, errors: errorMsgs};
  }

checkSwear = (text, convoId, server) => {
    matches = text.toLowerCase().match(profanity);
    if (!matches || matches.length == 0){
      return true;
    }
    return false;  
  }

checkLinks = (text, convoId, server) => {
  matches = text.match(links);
  if (!matches || matches.length == 0){
    return true
  } 
  return false;
}

checkPhone = (text, convoId, server) => {
  matches = text.match(phones);
  if(!matches || matches.length == 0){
    return true;
  }
  return false;
}

checkEmojis = (text, convoId, server) => {
  matches = text.match(emojiRegex());
  matches2 = text.match(emoticons);
  if((!matches || matches.length == 0) && (!matches2 || matches2.length == 0)){
    return true;
  }
  return false;
} 
checkEnglish = (text, convoId, server) => {
  englishCount = 0;
  text.split(" ").forEach((word) => {
    if( dict.check(word) ){
      englishCount++;    
    }
  });
  english = englishCount > text.split(" ").length / 2;
  if(!english){
    if(!server){
      Meteor.call('convos.incUserEnglishCount', convoId, Meteor.userId());
    }
    convo = Convos.findOne({_id: convoId});
    ret = true;
    convo.users.forEach((user) => {
      if (user.id == Meteor.userId() && user.englishCount >= 3){
        ret = false;
      }
    });
    return ret
  }else{
    Meteor.call('convos.resetUserEnglishCount', convoId, Meteor.userId());
    return true;  
  }
}
checkRepeated = (text, convoId, server) => {
  convo = Convos.findOne({_id: convoId});
  msg = Messages.findOne({_id: convo.msgs[convo.msgs.length - 1]});
  if(!!msg){
    if(msg.user == Meteor.userId() && msg.message == text){
      return false;
    }else{
      return true;
    }
  }else{
    return true;
  }

}

export { validate }
