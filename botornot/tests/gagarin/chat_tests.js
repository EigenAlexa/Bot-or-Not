
describe('chat testing suite', () => {
  server = meteor();
  client1 = browser(server); 
  client2 = browser(server);

  //TODO ADD before call that signs up two users

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

  it('should be able to route to /chat', () => {
    return waitForFlowRoute(client1, '/chat')
      .getText(".page-header")
      .then( (text) => {
        expect(text).to.include("CHAT");
      });
  });
  it('should connect two  anonymous users when they both route to chat', () => {
    return waitForFlowRoute(client1, '/chat')
      .then(() => {
        return waitForFlowRoute(client2,'/chat');
      })
      .waitForDOM(".message-panel", 50000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 10000);
      })
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
        return waitForFlowRoute(client1, '/chat');
      })
      .then(() => {
        return waitForFlowRoute(client2,'/chat');
      })
      .waitForDOM(".message-panel", 50000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 3000);
      })
      .then(() => {
        return leaveChat(client1, client2);
      });
  });
  it('should be fast the second time they connect', () => {
    return waitForFlowRoute(client1, '/chat')
      .then(() => {
        return waitForFlowRoute(client2,'/chat');
      })
      .waitForDOM(".message-panel", 5000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 3000);
      })
      .then(() => {
        return leaveChat(client1, client2);
      });
  });
  it('should connect when user refreshes or leaves chat and rejoins', () => {
    return waitForFlowRoute(client1, '/chat')
      .then(() => {
        return waitForFlowRoute(client2, '/chat')
      })
      .waitForDOM(".message-panel", 5000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 3000);
      })
      .then(()=> {
        return waitForFlowRoute(client2, '/');
      })
      .then(() => {
        return waitForFlowRoute(client2, '/chat');
      })
      .click("#next-chat")
      .waitForDOM(".message-panel", 5000)
      .then(() => {
        return client2.waitForDOM(".message-panel", 2000);
      })
  });
});
