import { Accounts } from "meteor/accounts-base"
Accounts.onCreateUser(function (options, user) {
        //format the 'user' object as you need it to be here
    //    // to pass your schema validation
    console.log(user);
    console.log(options);
    // user.profile = {
    //     sessions: 0,
	//     notratings: 0,
    //     conversations: [],
    //     online: false,
    //     in_convo: false
    // };
    return user;
})
