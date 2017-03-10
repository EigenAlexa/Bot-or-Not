
describe('chat testing suite', () => {
  server = meteor();
  client1 = browser(server); 
  client2 = browser(server);


  it('should be able to route to /chat', () => {
    return client1.waitForRoute('/chat')
      .getText(".page-header")
      .then( (text) => {
        expect(text).to.include("CHAT");
      });
  });
  it('should connect two users when they both route to chat', () => {
    return client2.waitForRoute('/chat')
      .then(() => {
        return client1.waitForRoute('/chat');
      })
  });
});
