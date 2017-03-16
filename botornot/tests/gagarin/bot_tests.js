utils = require('./utils.js');

describe('bots', () => {
  var server = meteor();
  var client1 = browser(server);
  var client2 = browser(server);

  it('should connect to a user after the timeout length', () => {
    return utils.waitForFlowRoute(client1, '/chat')  
      .waitForDOM(".message-panel", 45000) //TODO get value from meteor settings
      .then(() => {
        return utils.waitForFlowRoute(client1, '/');
      })
  });

  it('should send reply to user message', () => {
    return utils.waitForFlowRoute(client1, '/chat')
      .waitForDOM(".message-panel", 40000) 
      .sendKeys(".form-control", "hi" + utils.ENTER)
      .then(() => {
        return utils.waitForNthDOM(client1, ".from-them", 5000, 1);  
      })
      .then(() => {
        return utils.waitForFlowRoute(client1, "/");
      });
  });
  it('should kick bots from rooms if there are two users connected to bots', () => {
    return utils.waitForFlowRoute(client1, '/chat')
      .waitForDOM(".message-panel", 45000)
      .then(() => {
        return utils.waitForFlowRoute(client2, '/chat');
      })
      .waitForDOM("#next-chat", 25000)
      .click("#next-chat")
      .waitForDOM(".message-panel", 5000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 5000);
      })
      .sendKeys(".form-control", "test message" + utils.ENTER)
      .then(() => {
        return utils.expectNthTextToEqual(client2, ".from-them", "test message", 1);
      })
      .then(() => {
        return utils.leaveChat(client1, client2);
      })
  });
});
