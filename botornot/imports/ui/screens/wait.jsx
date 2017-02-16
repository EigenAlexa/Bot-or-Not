import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import ChatRender from './chatRender.jsx';
var WaitPage = React.createClass({
  render: function() {
    return (
      <div>
        <section className="section-background">
          <div className="container">
            <h3 className="page-header">
              Please wait while we connect you to an available bot/human
            </h3>
          </div> 
        </section> 
      </div>
    );
  }
});

export default WaitPage;