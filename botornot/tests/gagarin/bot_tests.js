utils = require('./utils.js');

describe('bots', () => {
  var server = meteor();
  var client1 = browser(server);
 // var client2 = browser(server);

  it('should connect to a user after the timeout length', () => {
    return utils.waitForFlowRoute(client1, '/chat')  
      .waitForDOM(".message-panel", 25000) //TODO get value from meteor settings
      .then(() => {
        return utils.waitForFlowRoute(client1, '/');
      })
  });

  it('should send reply to user message', () => {
    return utils.waitForFlowRoute(client1, '/chat')
      .waitForDOM(".message-panel", 20000) 
      .sendKeys(".form-control", "hi" + utils.ENTER)
      .then(() => {
        return utils.waitForNthDOM(client1, ".from-them", 5000, 1);  
      })
      .then(() => {
        return utils.waitForFlowRoute(client1, "/");
      });
  });

});
