import React, { PropTypes } from 'react';
import NavBar from '/imports/ui/components/NavBar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
import NotificationSystem from 'react-notification-system';

export default class Screen extends React.Component {
    renderRatingNotification(rating){
      notification = {
        title: rating == 'not' ? 'NOT' : 'BOT',
        message: "You were just rated as a " + rating + " for a previous conversation.",
        position: 'bc',
        level: rating == 'not'? 'success' : 'error',
        autoDismiss: 0,

      };
      this.refs.notificationsystem.addNotification(notification);
      Session.set('playNotification', "false");
    }
    componentDidMount(){ 
      Tracker.autorun(() => {
        playNotification = Session.get('playNotification');
        rating = Session.get('rating');
        if(playNotification == "true"){
          this.renderRatingNotification(rating);
        }
      });
    }

    render() {
        return (
            <div>
                <header>
                    <NavBar /> 
                </header>
                    {this.props.children}
              <Footer />
              <NotificationSystem ref='notificationsystem' />
            </div>
        );
    }
}
