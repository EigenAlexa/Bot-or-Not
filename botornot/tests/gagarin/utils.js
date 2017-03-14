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

module.exports = { ENTER, promiseFor, waitForFlowRoute, signUpOnPage, leaveChat, connectUsersToChat, waitForNthDOM, getNthText, expectNthTextToEqual };
