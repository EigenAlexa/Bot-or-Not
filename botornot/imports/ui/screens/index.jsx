import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';

var HomePage = React.createClass({
  render: function() {
    return (
      <div>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Bot or Not</title>

        
        /* Home */
        <div id="header">
          <div className="flexslider">
            <ul className="slides">
              <li className="slider-item" style={{backgroundImage: 'url("http://www.wallpaperup.com/uploads/wallpapers/2012/09/26/16626/8155b41ae43140299c342079a2c134dd.jpg")'}}> 
              </li> </ul>
            <div className="intro container">
              <div className="inner-intro">
                <h1 className="header-title">
                  <span>Bot</span> or Not
                </h1>
                <p className="header-sub-title">
                  lick.
                </p>
                <button className="btn custom-btn" onclick="location.href='chat.html'" type="button">
                  Start Chatting</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default HomePage;