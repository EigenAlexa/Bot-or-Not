var utils = require('./utils');

describe('chat connection suite', () => {
  server = meteor();
  client1 = browser(server); 
  client2 = browser(server);

  it('should be able to route to /chat', () => {
    return utils.waitForFlowRoute(client1, '/chat')
      .getText(".page-header")
      .then( (text) => {
        expect(text).to.include("CHAT");
      });
  });
  it('should connect two anonymous users when they both route to chat', () => {
    return utils.connectUsersToChat(client1, client2, 30000) 
      .then(() => {
        return utils.leaveChat(client1, client2);
      })
      
  });
  it('should connect two logged in users when they route to chat', () => {
    return utils.signUpOnPage(client1, 'tester1', 'tester')
      .then(() => {
        return utils.signUpOnPage(client2, 'tester2', 'tester');  
      })
      .then(() => {
        return utils.connectUsersToChat(client1, client2, 30000);
      })
  });
  it('should set firstTime to false for both users', () => {
    return client1.wait(2000, "until user is found", () => {
        return Meteor.users.findOne({username: "tester1"});
      })
      .then(() => {
        return client2.wait(2000, "until user is found", () => {
          return Meteor.users.findOne({username: "tester2"});  
        });
      })
      .then((user) => {
        return expect(user.firstTime).to.be.false;
      })
      .then(() => {
        return utils.leaveChat(client1, client2);
      });
  });
  it('should be fast the second time they connect', () => {
    return utils.connectUsersToChat(client1, client2, 25000)
      .then(() => {
        return utils.leaveChat(client1, client2);
      });
  });
  it('should connect when user refreshes or leaves chat and rejoins', () => {
    return utils.connectUsersToChat(client1, client2, 25000)
      .then(()=> {
        return utils.waitForFlowRoute(client2, '/');
      })
      .then(() => {
        return utils.waitForFlowRoute(client2, '/chat');
      })
      .waitForDOM("#next-chat", 2000)
      .click("#next-chat")
      .waitForDOM(".message-panel", 15000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 2000);
      })
  });
});

runChatInterfaceTests = (server, client1, client2) => {
  utils.sendMaxTurnsMessages = (server, client1, client2) => {
     return server.execute(() => {return Meteor.settings.maxTurns})
      .then((maxTurns) => {
        return utils.promiseFor( (count) => {return count < maxTurns / 2}, (count) => {
          return client1.sendKeys(".form-control", "test " + count.toString() + ENTER)
            .then(() => {
              return utils.waitForNthDOM(client2, ".from-them", 2000, count)
            })
            .then(() => {
              return client2.sendKeys(".form-control", "test " + count.toString() + ENTER); 
            })
            .then(() => {
              return utils.waitForNthDOM(client1, ".from-them", 2000, count)
            })
            .then(() => {
              return ++count;
            })  
        }, 0);        
      });
  };
  
  it('should receive user sent message within 2 seconds', () => {
    return utils.connectUsersToChat(client1, client2, 30000)
      .sendKeys(".form-control", "test message")
      .sendKeys(".form-control", ENTER)
      .then(() => {
        return utils.waitForNthDOM(client2, ".from-them", 2000, 1);
      })
      .then(() => {
        return utils.expectNthTextToEqual(client2, ".from-them", "test message", 1);
      })
      .then(() => {
        return utils.leaveChat(client1, client2);
      })
  });
  it('should show rate now button after max turns', () => {
    return utils.connectUsersToChat(client1, client2, 30000)
      .then(() => {
        return utils.sendMaxTurnsMessages(server,client1, client2)
      })
      .then(() => {
        return client1.waitForDOM('.rate-now')
      })
      .then(() => {
        return client1.wait(2000, "until rate enabled", () => {
          var elems = document.querySelector(".rate-now");
          return !elems.classList.contains("btn-disabled");
        })
      })
      .then(() => {
        return client2.waitForDOM('.rate-now')
      })
      .then(() => {
        return client2.wait(2000, "until rate enabled", () => {
          var elems = document.querySelector(".rate-now");
          return !elems.classList.contains("btn-disabled");
        })
      })
      .then(() => {
        return utils.leaveChat(client1, client2);
      });
  });
 // it('should show rating modal when the rate now button is clicked', () => {
 //   return utils.connectUsersToChat(client1, client2, 30000)
 //     .then(() => {
 //       return utils.sendMaxTurnsMessages(server,client1, client2); 
 //     })
 //   .waitForDOM(".rate-now", 2000)
 //   .then(() => {
 //     return utils.leaveChat(client1, client2);
 //   });
 // });
};

describe('chat interface logged in', () => {
  server2 = meteor();
  client3 = browser(server2);
  client4 = browser(server2);

  before(() => {
    return utils.signUpOnPage(client3, 'tester1', 'tester')
      .then(() => {
        return utils.signUpOnPage(client4, 'tester2', 'tester');
      });
  });

  runChatInterfaceTests(server2, client3, client4);
});

describe('chat interface anonymous', () => {
  server3 = meteor();
  client5 = browser(server3);
  client6 = browser(server3);

  runChatInterfaceTests(server3, client5, client6);
});
