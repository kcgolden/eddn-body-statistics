import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('materials');
  this.route('stars');
  this.route('about');
  this.route('planets');
  this.route('explorers');
  this.route('home');
});

export default Router;
