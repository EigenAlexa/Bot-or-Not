// import {ShareIt} from 'meteor/joshowens:shareit'
console.log('share');
  ShareIt.configure({
    sites: {                // nested object for extra configurations
        'facebook': {
            'appId': null   // use sharer.php when it's null, otherwise use share dialog
        },
        'twitter': {},
        'googleplus': {},
        'pinterest': {}
    },
    classes: "large btn", // string (default: 'large btn')
                          // The classes that will be placed on the sharing buttons, bootstrap by default.
    iconOnly: true,      // boolean (default: false)
                          // Don't put text on the sharing buttons
    applyColors: false,     // boolean (default: true)
                          // apply classes to inherit each social networks background color
    faSize: '',            // font awesome size
    faClass: ''       // font awesome classes like square
  });

cookies = new Cookies();

updateCookiesOnExit = () => {
  cookies.remove('session');
  cookies.remove('convoroute');
}

export { cookies, updateCookiesOnExit };
