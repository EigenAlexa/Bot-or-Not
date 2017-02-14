UserSchema = new SimpleSchema({
	sessions: {
		type: Number,
		label: "Sessions",
		defaultValue: 0
	},
	notratings: {
		type: Number,
		label: "NotRatings",
		defaultValue: 0
	},
    convos: {
        type: ConvoSchema,
        label: "conversations",
        defaultValue :[]
    },
	online: {
		type: Boolean,
		label: "online",
		defaultValue: false
	},
	in_convo: {
		type: Boolean,
		label: "in_convo",
		defaultValue: false
	}
});
Meteor.users.attachSchema(UserSchema);
// users = new Mongo.Collection("users")
// users.attachSchema(UserSchema);
// export default users;
