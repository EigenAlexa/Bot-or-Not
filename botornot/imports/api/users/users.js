const Schema = {};

Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object,
        optional: true
        // temp
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
        // temp
    },
    "emails.$.verified": {
        type: Boolean,
        optional: true
        // temp
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
        optional: true
        // temp
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true
    },
    'roles.$': {
        type: String,
        optional: true
        // temp
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    },
   	sessions: {
  		type: Number,
  		label: "Sessions",
  		defaultValue: 0,
          optional: false
  	},
  	notratings: {
  		type: Number,
  		label: "NotRatings",
  		defaultValue: 0
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
  	},
      violations: {
          type: Number,
          label: "",
          defaultValue: 0
      },
    rating: {
      type: Number,
      label: "rating",
      defaultValue: 0
    }

});

Meteor.users.attachSchema(Schema.User);

Meteor.users.after.update( (userId, doc, fieldNames, modifier, options) => {
  if ('sessions' in fieldNames || 'notratings' in fieldNames){
    if (doc.sessions !== this.previous.sessions || doc.notratings !== this.previous.notratings){
      if (doc.sessions == 0){
        doc.rating = 0;
     } else {
        doc.rating = Math.pow(doc.notratings, 2) / doc.sessions;
      }
    }
  }
}, {fetchPrevious: true});
