import { profanity, links, phones, emoticons } from '/imports/ui/static/validationRegex.js'; 
import emojiRegex from 'emoji-regex';
import { Convos } from '/imports/api/convos/convos.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Meteor } from 'meteor/meteor';
/*import typo from 'typo-js';
import aff from '/imports/ui/static/en_US.aff.js';
import dic from '/imports/ui/static/en_US.dic.js';

dict = new typo("en_US", aff, dic, {}); 
*/
validate = (text, convoId) => {
    valid = true;
    errorMsgs = [];
    tests = [ {func: checkSwear, errorMsg: "Please don't use profanity in your messages."},
              {func: checkLinks, errorMsg: "Please don't put emails/links in your messages."},
              {func: checkPhone, errorMsg: "Please don't put phone numbers in your messages."},
              {func: checkEmojis, errorMsg: "Please don't put emojis in your messages."},
              {func: checkRepeated, errorMsg: "Please don't spam messages."},
              //{func: checkEnglish, errorMsg: "Please make sure you are using English words."},
            ] 
    tests.forEach((test) => {
      if(!test.func(text, convoId)){
        valid = false;
        errorMsgs.push(test.errorMsg);
      }
    });
    return {valid: valid, errors: errorMsgs};
  }

checkSwear = (text, convoId) => {
    matches = text.toLowerCase().match(profanity);
    if (!matches || matches.length == 0){
      return true;
    }
    return false;  
  }

checkLinks = (text, convoId) => {
  matches = text.match(links);
  if (!matches || matches.length == 0){
    return true
  } 
  return false;
}

checkPhone = (text, convoId) => {
  matches = text.match(phones);
  if(!matches || matches.length == 0){
    return true;
  }
  return false;
}

checkEmojis = (text, convoId) => {
  matches = text.match(emojiRegex());
  matches2 = text.match(emoticons);
  if((!matches || matches.length == 0) && (!matches2 || matches2.length == 0)){
    return true;
  }
  return false;
} 
/* checkEnglish = (text) => {
  englishCount = 0;
  text.split(" ").forEach((word) => {
    if( dict.check(word) ){
      englishCount++;    
    }
  });
  return englishCount > text.split(" ").length / 2;
} */
checkRepeated = (text, convoId) => {
  convo = Convos.findOne({_id: convoId});
  msg = Messages.findOne({_id: convo.msgs[convo.msgs.length - 1]});
  console.log(msg);
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
