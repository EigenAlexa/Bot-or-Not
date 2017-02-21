import { Meteor } from 'meteor/meteor';

import { createContainer } from 'meteor/react-meteor-data';

import NavBar from '/imports/ui/components/NavBar.jsx';

export default NavbarContainer = createContainer(() => {
    return {
        currentUser: Meteor.user()
    };
}, NavBar);