/**
 * Application-specific Router. Includes routes configuration, defaults,
 * error pages, etc.
 */
var context = require('./context');
var About = require('./components/screens/about.jsx');
var Error = require('./components/screens/error.jsx');
var Home = require('./components/screens/home.jsx');
var Machines = require('./components/screens/machines.jsx');

context
  .createRoute('home', {
    path: '/',
    title: 'Home',
    body: Home
  })
  .createRoute('machines', {
    path: '/machines/:userId',
    title: 'Machines',
    body: Machines
  })
  .createRoute('about', {
    path: '/about',
    title: 'About',
    body: About
  })
  .createErrorRoute(404, {
    title: 'Not Found',
    body: Error
  })
  .createErrorRoute(500, {
    title: 'Unexpected Error',
    body: Error
  });
