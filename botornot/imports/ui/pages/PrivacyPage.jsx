import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

var PrivacyPage = React.createClass({
  render: function() {
    return (
      <div>
        <title>Bot or Not</title>
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

export default PrivacyPage;