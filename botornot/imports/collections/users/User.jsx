UserSchema = new SimpleSchema({
	username: {
		type: String,
		label: "Username",
		max: 30
	},
	password: {
		type: String,
		label: "Password",
		max: 30
	},
	sessions: {
		type: Number, 
		label: "Sessions",
	}
	notratings: {
		type: Number,
		label: "NotRatings"
	}
})