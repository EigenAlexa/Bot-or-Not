
import mongo from 'meteor/mongo';

RatingSchema = new SimpleSchema({
	bottiness: { // rating 1-5 how botty
		type: Number,
		label: "bottiness",
        optional: false
	},
    engagement : { // rating 1-5 how engaging
        type: Number,
        label: "engagement",
        optional: false
    },
    comments : {
        type: String,
        label: "comments",
        optional: true,
    },
});

const Ratings = new Mongo.Collection("ratings");
Ratings.attachSchema(RatingSchema);

export { Ratings };
