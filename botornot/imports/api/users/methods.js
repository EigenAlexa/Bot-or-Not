
/**Meteor.methods({
  'users.getTopN'(N) {
    cursor = Meteor.users.find({}, {
      sort: {rating: -1}, 
      limit: N}
      );
    return cursor.fetch();  
  }
});
*/
