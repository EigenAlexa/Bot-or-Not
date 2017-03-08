import React, { PropTypes } from 'react';
import NavBar from '/imports/ui/components/NavBar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
import NotificationSystem from 'react-notification-system';

export default class Screen extends React.Component {
    constructor(props) {
      super(props);
      this.renderOffTopicNotification = this.renderOffTopicNotification.bind(this);
    }

    renderRatingNotification(rating){
      notification = {
        title: rating == 'not' ? 'NOT' : 'BOT',
        message: "You were just rated as a " + rating + " for a previous conversation.",
        position: 'bc',
        level: rating == 'not'? 'success' : 'error',
        autoDismiss: 5,

      };
      this.refs.notificationsystem.addNotification(notification);
      Meteor.call('users.setRated', Meteor.userId());
      Session.set('playNotification', "false");
    }

    renderOffTopicNotification(){
      this.setState({offTopic : true});
      notification = {
        title: 'Marked Conversation as Off Topic',
        message: "Thanks for letting us know that the conversation was off topic.",
        position: 'bc',
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
            Meteor.call('convos.markOffTopic', Session.get('curConvo'), Meteor.userId());
          }
        }

      };
      this.refs.notificationsystem.addNotification(notification);
      Session.set('notifyOffTopic', "false");
      
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
