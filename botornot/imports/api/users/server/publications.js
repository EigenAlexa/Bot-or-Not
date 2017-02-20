
Meteor.publish('topNUsers', (N) => {
  return Meteor.users.find({}, {
    sort: {rating: -1},
    limit: N,
    fields: {username: 1, rating: 1}
  });
});
