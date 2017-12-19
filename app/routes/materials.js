import Route from '@ember/routing/route';
import Ember from 'ember';

export default Route.extend({
    model() {
        return Ember.$.getJSON("data/planetMatsByPlanetType.json");
    }
});
