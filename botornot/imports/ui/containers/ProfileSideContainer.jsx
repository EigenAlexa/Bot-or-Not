import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Convos } from '/imports/api/convos/convos.js';
import ProfileSide from '/imports/ui/components/ProfileSide.jsx';

ProfileSideContainer = createContainer(({ username }) => {
  if (!!username) {
    console.log('username', username)
    userHandle = Meteor.subscribe('userProfile', username);
    ratingsHandle = Meteor.subscribe('users.ratings');
    userCursor = Meteor.users.find({username: username});
    loading = !userHandle.ready();
    user = Meteor.users.findOne({username: username});
    ranking = !!user && ratingsHandle.ready() ? Meteor.users.find({rating: {$gt: user.rating}}).count() + 1: -1;

    console.log(Convos.find().fetch(), 'finding convos');
    currentUser = loading ? {}: Meteor.users.findOne({_id: Meteor.userId()});
    isSelfProfile = !!currentUser &&  !!currentUser['username'] && currentUser.username == username;
    signedIn = !user.anon;
  }
  else {
    user = null; 
    username = null;
    signedIn = false;
    user = null; 
    username = null;
    loading = false;
    ranking = null;
    signedIn = false;
    isSelfProfile = false;
  }
  return {
    user, 
    username,
    signedIn,
    user, 
    username,
    loading,
    ranking,
    isSelfProfile,
    userExists : !!user, 
  };
}, ProfileSide);
export {ProfileSideContainer };
