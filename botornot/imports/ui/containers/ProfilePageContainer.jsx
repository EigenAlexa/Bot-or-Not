import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import ProfilePage from '/imports/ui/pages/ProfilePage.jsx';

export default ProfileContainer = createContainer(({ params: { params } }) => {
    const username = params.username;
    const userHandle = Meteor.subscribe('userProfile', username);
    const notConvoHandle = Meteor.subscribe('userNotConvos', username);
    const botConvoHandle = Meteor.subscribe('userBotConvos', username);
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
    const convosLoading = !botConvoHandle.ready() || !notConvoHandle.ready();
    
    const notConvos = convosLoading ? [] : Convos.find(
      {'users.rated': 'not'},  
      {limit : 5}).fetch();

    console.log(Convos.find().fetch(), 'finding convos');
    const botConvos = convosLoading ? [] : Convos.find(
      {'users.rated': 'bot'},
      {limit : 5}).fetch();

    const currentUser = loading ? {}: Meteor.users.findOne({_id: Meteor.userId()});
    const isSelfProfile = !!currentUser &&  !!currentUser['username'] &&currentUser.username == username;

    return {
      user, 
      username,
      loading,
      ranking,
      userExists : !!user, 
      convosLoading,
      botConvos,
      notConvos,
      isSelfProfile
    };
}, ProfilePage);
