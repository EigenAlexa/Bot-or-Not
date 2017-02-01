ConvoSchema = new SimpleSchema({
	idNumber: {
		type: Number,
		label: "idNumber"
	},
	user1: {
		type: String, 
		label: "user1"
	},
	user2: {
		type: String,
		label: "user2"
	},
	length: {
		type: Number, 
		label: "length"
	}
	messages: {
		type: Array,
		label: "messages"
	}
})