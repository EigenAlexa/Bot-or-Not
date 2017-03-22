import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import LeaderboardPage from '../pages/LeaderboardPage';

export default LeaderboardContainer = createContainer(() => {
  const usersHandle = Meteor.subscribe('topNUsers', 25);
  const userHandle = Meteor.subscribe('currentUser', Meteor.userId());
  const loading = !usersHandle.ready() || !userHandle.ready();
  const query = {
    sort: {rating: -1},
    limit: 25,
    fields: {username: 1, rating: 1, level: 1} 
  };
  return {
    users: loading ? [] : Meteor.users.find({}, query).fetch(),
    currentUser: loading ? {}: Meteor.users.findOne({_id: Meteor.userId()}),
  };
}, LeaderboardPage);
