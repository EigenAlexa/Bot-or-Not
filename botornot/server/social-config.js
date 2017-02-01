ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '322625308138759',
    secret: '0cb685bac8e776cfaa72183d0cdcd58d'
});

<template name="login">
    {{#if currentUser}}
        {{currentUser.services.facebook.name}}
        <button id="logout">Logout</button>
    {{else}}
        <button id="facebook-login" class="btn btn-default"> Login with Facebook</button>
    {{/if}}
</template>

Template.login.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },
 
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});
