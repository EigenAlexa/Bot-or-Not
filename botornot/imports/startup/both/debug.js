import { Meteor } from 'meteor/meteor';

export class Debug {
    static log(string) {
        if (Meteor.settings.Debug) {
            console.log(string);
        }
    }
    static resetDb() {
        return !!Meteor.settings.ResetDb;
    }
}
