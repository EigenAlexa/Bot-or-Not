import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import Navigation from 'react-router';

var HomePage = React.createClass({

  render() {
    return (
      <div>
        <title>Bot or Not</title>
        /* Home */
        <div id="header">
          <div className="flexslider">
            <ul className="slides">
              <li className="slider-item" style={{backgroundImage: 'url("http://www.wallpaperup.com/uploads/wallpapers/2012/09/26/16626/8155b41ae43140299c342079a2c134dd.jpg")'}}> 
              </li>
             </ul>
            <div className="intro container">
              <div className="inner-intro">
                <h1 className="header-title">
                  <span>Bot</span> or Not
                </h1>
                <a className="btn custom-btn" href='/chat'>
                  Start Chatting</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default HomePage;
