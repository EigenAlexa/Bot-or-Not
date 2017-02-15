import { Accounts } from "meteor/accounts-base"
// TODO schedule for deletion. Only used for debugging.
Accounts.onCreateUser(function (options, user) {
    console.log(user);
    return user;
})
