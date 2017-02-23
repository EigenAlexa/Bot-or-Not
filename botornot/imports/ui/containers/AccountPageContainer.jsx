import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import AccountPage from '../pages/AccountPage.jsx';

export default AccountContainer = createContainer(({ params: { params } }) => {
    const username = params.username;
    const userHandle = Meteor.subscribe('userProfile', username);
    const ratingsHandle = Meteor.subscribe('users.ratings');
    const userCursor = Meteor.users.find({username: username});
    // userCursor.observe({
    //   changed: (newUser, oldUser) => {
    //     if (!newUser){
    //       return;
    //     }
    //     if (!newUser.in_convo && oldUser.in_convo){
    //       console.log("callback for user leaving: " + newUser._id);
    //       FlowRouter.go('closed', {}, {convoId: oldUser.curConvo, userLeft: newUser.left});
    //     }
    //   }
    // });
    const loading = !userHandle.ready();
    const user = Meteor.users.findOne({username: username});
    const ranking = !!user && ratingsHandle.ready() ? Meteor.users.find({rating: {$gt: user.rating}}).count() + 1: -1;
    return {
      user, 
      username,
      loading,
      ranking,
      userExists : !!user 
	};
}, AccountPage);
