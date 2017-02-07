var ChatPage = React.createClass({
  render: function() {
    return (
      <div>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Bot or Not</title>

        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            {/* Brand and toggle get grouped for better mobile display */}
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="index.html" title="HOME"><i className="none" /> Bot <span>or Not</span></a>
            </div> {/* /.navbar-header */}
            {/* Collect the nav links, forms, and other content for toggling */}
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="index.html">Home</a></li>
                <li className="active"><a href="chat.html">Chat</a></li>
                <li><a href="leaderboards.html">Leaderboards</a></li>
                <li><a href="privacy.html">Privacy</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul> {/* /.nav */}
            </div>{/* /.navbar-collapse */}
          </div>{/* /.container */}
        </nav>{/* /#header */}
        {/* deleted end section */}
        {/* Section Background */}
        <section className="section-background">
          <div className="container">
            <h2 className="page-header">
              Chat
            </h2>
          </div> {/* /.container */}
        </section> {/* /.section-background */}
        <ul className="social-icon">
          <li><a href="#"><i className="ion-social-twitter" /></a></li>
          <li><a href="#"><i className="ion-social-facebook" /></a></li>
          <li><a href="#"><i className="ion-social-linkedin-outline" /></a></li>
          <li><a href="#"><i className="ion-social-googleplus" /></a></li>
        </ul>{/* /.subscribe */}
        {/* deleted end div */}
      </div>
    );
  }
});