
describe('chat testing suite', () => {
  server = meteor();
  client1 = browser(server); 
  client2 = browser(server);

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

  it('should be able to route to /chat', () => {
    return waitForFlowRoute(client1, '/chat')
      .getText(".page-header")
      .then( (text) => {
        expect(text).to.include("CHAT");
      });
  });
  it('should connect two users when they both route to chat', () => {
    return waitForFlowRoute(client1, '/chat')
      .then(() => {
        return waitForFlowRoute(client2,'/chat');
      })
    
  });
});
