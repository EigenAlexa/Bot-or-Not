var Promise = require('bluebird');

ENTER = '\ue007';

var promiseFor = Promise.method(function(condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
});

waitForFlowRoute = (client, path) => {
  return client.execute(function (path) {
    FlowRouter.go(path);
  }, [ path ])
  .wait(10000, 'until current path is ' + path, function (path) {
    
    var controller = FlowRouter.current();
    var pathOK = (window.location.pathname + window.location.search + window.location.hash === path);

    if (controller && pathOK ) {
      return true;
    } else {
      FlowRouter.go(path);
    }
  }, [ path ]);
};

signUpOnPage = (client, user, password) => {
  return client.execute(() => {
    console.log("logging out");
    return Meteor.logout(() => {console.log("logged out")});
  }).wait(5000, "until logged out", () => {
    if (!Meteor.userId()) {
      return true; 
    }else {
      Meteor.logout();
    }
  })
    .then( () => {
      waitForFlowRoute(client, '/sign-up')
    })
    .then(() => {
      return client.waitForDOM("#at-field-username", 10000);
    })
    .then(() => {
      return client.sendKeys("#at-field-username", user);
    })
    .then(() => {
      return client.sendKeys("#at-field-password", password);
    })
    .then(() => {
      return client.sendKeys("#at-field-password_again", password);
    })
    .then(() => {
      return client.click("#at-btn");
    })
    .then(() => {
      return client.waitForDOM(".home-btn", 10000);
    });
};
leaveChat = (client1, client2) => {
  return waitForFlowRoute(client1, '/')
    .then(() => {
      return client2.waitForDOM("#next-chat", 5000);
    })
    .then(() => {
      return client2.click('#next-chat');
    })
    .then(() => {
      return waitForFlowRoute(client2, '/');
    });
}; 
connectUsersToChat = (client1, client2, timeout) => {
  return waitForFlowRoute(client1, '/chat')
    .then(() => {
      return waitForFlowRoute(client2,'/chat');
    })
    .waitForDOM(".message-panel", timeout)
    .then(() => {
      return client2.waitForDOM(".message-panel", 2000);
    })
};
waitForNthDOM = (client, selector, timeout, N) => {
    return client.wait(timeout, 'until element ' + selector + ' is present', function (selector, N) {
      return !!document.querySelectorAll(selector)[N];
    }, [ selector, N ]);
};

getNthText = (client, selector, N) => {
    return waitForNthDOM(client, selector, 5000, N).execute(function (selector, N) {
      var element = document.querySelectorAll(selector)[N];
      return element && element.innerHTML;
    }, [ selector, N ]);
};
expectNthTextToEqual = (client, selector, value, N) => {
    return getNthText(client, selector, N).then(function (text) {
      expect(text).to.be.eql(value);
    });
};

describe('chat connection suite', () => {
  server = meteor();
  client1 = browser(server); 
  client2 = browser(server);

  it('should be able to route to /chat', () => {
    return waitForFlowRoute(client1, '/chat')
      .getText(".page-header")
      .then( (text) => {
        expect(text).to.include("CHAT");
      });
  });
  it('should connect two anonymous users when they both route to chat', () => {
    return connectUsersToChat(client1, client2, 30000) 
      .then(() => {
        return leaveChat(client1, client2);
      })
      
  });
  it('should connect two logged in users when they route to chat', () => {
    return signUpOnPage(client1, 'tester1', 'tester')
      .then(() => {
        return signUpOnPage(client2, 'tester2', 'tester');  
      })
      .then(() => {
        return connectUsersToChat(client1, client2, 30000);
      })
  });
  it('should set firstTime to false for both users', () => {
    return client1.wait(2000, "until user is found", () => {
        return Meteor.users.findOne({username: "tester1"});
      })
      .then((user) => {
        return expect(user.firstTime).to.be.false;
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
        return leaveChat(client1, client2);
      });
  });
  it('should be fast the second time they connect', () => {
    return connectUsersToChat(client1, client2, 25000)
      .then(() => {
        return leaveChat(client1, client2);
      });
  });
  it('should connect when user refreshes or leaves chat and rejoins', () => {
    return connectUsersToChat(client1, client2, 25000)
      .then(()=> {
        return waitForFlowRoute(client2, '/');
      })
      .then(() => {
        return waitForFlowRoute(client2, '/chat');
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
  sendMaxTurnsMessages = (server, client1, client2) => {
     return server.execute(() => {return Meteor.settings.maxTurns})
      .then((maxTurns) => {
        return promiseFor( (count) => {return count < maxTurns / 2}, (count) => {
          return client1.sendKeys(".form-control", "test " + count.toString() + ENTER)
            .then(() => {
              return waitForNthDOM(client2, ".from-them", 2000, count)
            })
            .then(() => {
              return client2.sendKeys(".form-control", "test " + count.toString() + ENTER); 
            })
            .then(() => {
              return waitForNthDOM(client1, ".from-them", 2000, count)
            })
            .then(() => {
              return ++count;
            })  
        }, 0);        
      });
  };
  
  it('should receive user sent message within 2 seconds', () => {
    return connectUsersToChat(client1, client2, 30000)
      .sendKeys(".form-control", "test message")
      .sendKeys(".form-control", ENTER)
      .then(() => {
        return waitForNthDOM(client2, ".from-them", 2000, 1);
      })
      .then(() => {
        return expectNthTextToEqual(client2, ".from-them", "test message", 1);
      })
      .then(() => {
        return leaveChat(client1, client2);
      })
  });
  it('should show rate now button after max turns', () => {
    return connectUsersToChat(client1, client2, 30000)
      .then(() => {
        return sendMaxTurnsMessages(server,client1, client2)
      })
      .waitForDOM(".rate-now", 2000)
      .then(() => {
        return leaveChat(client1, client2);
      });
  });
 // it('should show rating modal when the rate now button is clicked', () => {
 //   return connectUsersToChat(client1, client2, 30000)
 //     .then(() => {
 //       return sendMaxTurnsMessages(server,client1, client2); 
 //     })
 //   .waitForDOM(".rate-now", 2000)
 //   .then(() => {
 //     return leaveChat(client1, client2);
 //   });
 // });
};

describe('chat interface logged in', () => {
  server2 = meteor();
  client3 = browser(server2);
  client4 = browser(server2);

  before(() => {
    return signUpOnPage(client3, 'tester1', 'tester')
      .then(() => {
        return signUpOnPage(client4, 'tester2', 'tester');
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
