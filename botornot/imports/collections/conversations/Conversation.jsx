ConvoSchema = new SimpleSchema({
	idNumber: {
		type: Number,
		label: "idNumber",
		defaultValue: 0
	},
	user1: {
		type: String, 
		label: "user1",
		defaultValue: ""
	},
	user2: {
		type: String,
		label: "user2",
		defaultValue: ""
	},
	length: {
		type: Number, 
		label: "length",
		defaultValue: 0
	},
	messages: {
		type: Array,
		label: "messages",
		defaultValue: []
	}
});