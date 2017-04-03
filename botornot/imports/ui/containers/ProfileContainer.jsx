import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import ProfilePage from '/imports/ui/pages/ProfilePage.jsx';
import ProfileSide from '/imports/ui/components/ProfileSide.jsx';

const makeProfContainer = (useConvos) => { 

    return ({ params: { params } }) => {
      username = params.username;


      if (!!username) {
        userHandle = Meteor.subscribe('userProfile', username);
        if (useConvos) {
          notConvoHandle = Meteor.subscribe('userNotConvos', username);
          botConvoHandle = Meteor.subscribe('userBotConvos', username);
          convosLoading = !botConvoHandle.ready() || !notConvoHandle.ready();
        }
        else {
          convosLoading = true;
        }
        ratingsHandle = Meteor.subscribe('users.ratings');
        userCursor = Meteor.users.find({username: username});

        loading = !userHandle.ready();
        user = Meteor.users.findOne({username: username});
        notConvos = convosLoading ? [] : Convos.find(
          {'users.rated': 'not'},  
          {limit : 5}).fetch();


        botConvos = convosLoading ? [] : Convos.find(
          {'users.rated': 'bot'},
          {limit : 5}).fetch();

        currentUser = loading ? {}: Meteor.users.findOne({_id: Meteor.userId()});
        isSelfProfile = !!currentUser &&  !!currentUser['username'] &&currentUser.username == username;
        signedIn = false; 

        return {
          user, 
          username,
          signedIn,
          loading,
          convosLoading,
          isSelfProfile,
          botConvos,
          notConvos,
          isSelfProfile,
          userExists : !!user
        };
      }
      else {
        return {
          user: null,
          username: null,
          signedIn:  false,
          userExists : false
        };
      }
    
  };
}
// Containers.
ProfilePageContainer = createContainer(makeProfContainer(true), ProfilePage);
ProfileSideContainer = createContainer(makeProfContainer(false), ProfileSide);

export { ProfilePageContainer,  ProfileSideContainer};
