import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
    model() {
        return RSVP.hash({
            generalCounts: Ember.$.getJSON("data/generalCounts.json"),
            timeScans: Ember.$.getJSON("data/scanTimes.json")
        });
    }
});
