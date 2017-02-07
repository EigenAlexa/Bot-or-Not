var PrivacyPage = React.createClass({
  render: function() {
    return (
      <div>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Bot or Not</title>

        <section>
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
                  <li><a href="chat.html">Chat</a></li>
                  <li><a href="leaderboards.html">Leaderboards</a></li>
                  <li className="active"><a href="privacy.html">Privacy</a></li>
                  <li><a href="contact.html">Contact</a></li>
                </ul> {/* /.nav */}
              </div>{/* /.navbar-collapse */}
            </div>{/* /.container */}
          </nav>
        </section> {/* /#header */}
        {/* Section Background */}
        <section className="section-background">
          <div className="container">
            <h2 className="page-header">
              Privacy Policy
            </h2>
          </div> {/* /.container */}
        </section> {/* /.section-background */}
        <section className="features section-wrapper">
          <div className="container">
            <h2 className="section-title">
              Features
            </h2>
            <p className="section-subtitle">
              Lorem Ipsum is simply dummy text of the industry.
            </p>
            <div className="row custom-table">
              <div className="grid-50 table-cell">
                <p className="features-details">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ante ex, fermentum vel libero eget interdum semper libero. Curabitur egestas, arcu id tempor convallis.
                </p>
                <ul className="features-list">
                  <li>Vestibulum pulvinar commodo malesuada.</li>
                  <li>Pellentesque id massa et ligula convallis porta.</li>
                  <li>Vivamus sed nunc sed ligula rhoncus sit amet eu elit.</li>
                  <li> Curabitur in ipsum vel ipsum vehicula congue.</li>
                </ul>
                <a href="contact.html" className="btn btn-default custom-button border-radius">
                  Contact
                </a>
              </div>
            </div>
            <ul className="social-icon">
              <li><a href="#"><i className="ion-social-twitter" /></a></li>
              <li><a href="#"><i className="ion-social-facebook" /></a></li>
              <li><a href="#"><i className="ion-social-linkedin-outline" /></a></li>
              <li><a href="#"><i className="ion-social-googleplus" /></a></li>
            </ul>
          </div> {/* /.subscribe */}
        </section>
        {/* added section tag */}
      </div>
    );
  }
});