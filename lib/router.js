/**
 * Application-specific Router. Includes routes configuration, defaults,
 * error pages, etc.
 */
var context = require('./context');
var About = require('./components/screens/about.jsx');
var Error = require('./components/screens/error.jsx');
var Home = require('./components/screens/home.jsx');
var SignIn = require('./components/screens/signin.jsx');
var SignOut = require('./components/screens/signout.jsx');

context
  .createRoute('home', {
    path: '/',
    title: 'Home',
    body: Home,
    action: 'user:users'
  })
  .createRoute('signin', {
    path: '/signin',
    body: SignIn,
  })
  .createRoute('singout', {
    path: '/signout',
    body: SignOut,
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
