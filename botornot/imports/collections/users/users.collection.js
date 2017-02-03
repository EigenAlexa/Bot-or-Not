
UserSchema = new SimpleSchema({
	username: {
		type: String,
		label: "Username",
		max: 30,
		defaultValue: "Username"
	},
	password: {
		type: String,
		label: "Password",
		max: 30,
		defaultValue: "Password"
	},
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
	connected: {
		type: Boolean,
		label: "connected", 
		defaultValue: false 
	},
	inconversation: {
		type: Boolean,
		label: "inConversation",
		defaultValue: false
	}
});

export const users = new Mongo.Collection("users").attachSchema(UserSchema);