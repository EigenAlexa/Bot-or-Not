import React, { PropTypes } from 'react';
import NavBar from '/imports/ui/components/NavBar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
import { ProfileSideContainer } from '/imports/ui/containers/ProfileContainer.jsx';
import NotificationSystem from 'react-notification-system';
import Favicon from 'react-favicon';

export default class Screen extends React.Component {
    constructor(props) {
      super(props);
      this.renderOffTopicNotification = this.renderOffTopicNotification.bind(this);
      Session.set('showBugModal', false);
      Session.set('notifyNumTurnsOpen', 'false');
    }

    renderRatingNotification(rating){
      notification = {
        title: rating == 'not' ? 'NOT' : 'BOT',
        message: "You were just rated as a " + rating + " for a previous conversation.",
        level: rating == 'not'? 'success' : 'error',
        autoDismiss: 5,

      };
      this.refs.notificationsystem.addNotification(notification);
      Meteor.call('users.setRated');
      Session.set('playNotification', "false");
    }

    renderOffTopicNotification(){
      this.setState({offTopic : true});
      notification = {
        title: 'Marked Conversation as Off Topic',
        message: "Thanks for letting us know that the conversation was off topic.",
        level: 'success',
        autoDismiss: 5,
        action : {
          label: 'Undo', 
          callback: () => {
            this.setState({offTopic : false});
          }
        },
        onRemove: () => {
          if (this.state.offTopic) {
            Meteor.call('convos.markOffTopic', Session.get('curConvo'));
          }
        }

      };
      this.refs.notificationsystem.addNotification(notification);
      Session.set('notifyOffTopic', "false");
      
    }

    renderTurnsNotification(turnsLeft) {
      notification = {
        title: 'Keep Talking!',
        message: "You have " + turnsLeft + " conversation turns left before you can rate the other user.",
        level: 'error',
        autoDismiss: 5,
        onRemove: () => {
          Session.set('notifyNumTurnsOpen', 'false');
        }

      };
      Session.set('notifyNumTurnsOpen', 'true');
      this.refs.notificationsystem.addNotification(notification);
      Session.set('notifyNumTurns', "false");

    }

    componentDidMount(){ 
      Tracker.autorun(() => {
        playNotification = Session.get('playNotification');
        rating = Session.get('rating');
        if(playNotification == "true"){
          this.renderRatingNotification(rating);
        }
    
        offTopicNotification = Session.get('notifyOffTopic');
        if (offTopicNotification == "true") {
          this.renderOffTopicNotification();
        }

        turnsNotification = Session.get('notifyNumTurns');
        turnsNotifOpen = Session.get('notifyNumTurnsOpen');
        if (turnsNotification == "true" && turnsNotifOpen == "false") {
          turnsLeft = Session.get('turnsLeft');
          this.renderTurnsNotification(turnsLeft);
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
              {!this.props.customFooter ? <Footer /> : ""}
              <NotificationSystem ref='notificationsystem' />
            </div>
        );
    }
}
