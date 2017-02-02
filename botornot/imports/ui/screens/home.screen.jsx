import React, { PropTypes } from 'react';
import { Blaze } from 'meteor/blaze';
import ReactAutoForm from 'meteor-react-autoform';
import Screen from '/imports/ui/layouts/screen.jsx';
import MessageSchema from '/imports/collections/messages/messages.collection.js';
import messages from '/imports/collections/messages/messages.collection.js';

const mes = () => {
  <template name="message">
    <p> testing material </p>
  </template>
} 

class HomeScreen extends React.Component {
  render () {
    return (
      <Screen>
        <div style={{height: $(window).height()}}>
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="text-center home-title">Meteor-scaffolding</h1>
                <p>Swag and stuff</p>
                <button onClick={this.exciting}> click me </button> 
              </div>
            </div>
          </div>
          <div className="navbar-fixed-bottom">
            <div className="container">
              <div style={{minHeight: '10px'}}></div>
            </div>
          </div>
        </div>
      </Screen>
    )
  }
  componentDidMount() {
    require('/imports/ui/layouts/screen.jsx');
    // Layout.currentScreenDidMount();
  }
  exciting () {
    const num = Math.floor((Math.random() * 10) + 1);
    const newMessage = {user: "Neel", message: num.toString()};
    console.log(num.toString());
  }

}

export default HomeScreen;