import { profanity, links, phones, emoticons } from '/imports/ui/static/validationRegex.js'; 
import emojiRegex from 'emoji-regex';
import typo from 'typo-js';
import aff from '/imports/ui/static/en_US.aff.js';
import dic from '/imports/ui/static/en_US.dic.js';

dict = new typo("en_US", aff, dic, {}); 

validate = (text) => {
    valid = true;
    errorMsgs = [];
    tests = [ {func: checkSwear, errorMsg: "Please don't use profanity in your messages."},
              {func: checkLinks, errorMsg: "Please don't put emails/links in your messages."},
              {func: checkPhone, errorMsg: "Please don't put phone numbers in your messages."},
              {func: checkEmojis, errorMsg: "Please don't put emojis in your messages."},
              {func: checkEnglish, errorMsg: "Please make sure you are using English words."},
            ] 
    tests.forEach((test) => {
      if(!test.func(text)){
        valid = false;
        errorMsgs.push(test.errorMsg);
      }
    });
    return {valid: valid, errors: errorMsgs};
  }

checkSwear = (text) => {
    matches = text.match(profanity);
    if (!matches || matches.length == 0){
      return true;
    }
    return false;  
  }

checkLinks = (text) => {
  matches = text.match(links);
  if (!matches || matches.length == 0){
    return true
  } 
  return false;
}

checkPhone = (text) => {
  matches = text.match(phones);
  if(!matches || matches.length == 0){
    return true;
  }
  return false;
}

checkEmojis = (text) => {
  matches = text.match(emojiRegex());
  matches2 = text.match(emoticons);
  if((!matches || matches.length == 0) && (!matches2 || matches2.length == 0)){
    return true;
  }
  return false;
} 
checkEnglish = (text) => {
  englishCount = 0;
  text.split(" ").forEach((word) => {
    if( dict.check(word) ){
      englishCount++;    
    }
  });
  return englishCount > text.split(" ").length / 2;
}

export { validate }
