/**
 * Application-specific Router. Includes routes configuration, defaults,
 * error pages, etc.
 */
var context = require('./context');
var AboutScreen = require('./components/screens/about.jsx');
var ErrorScreen = require('./components/screens/error.jsx');
var HomeScreen = require('./components/screens/home.jsx');
var SignInScreen = require('./components/screens/signin.jsx');
var SignOutScreen = require('./components/screens/signout.jsx');
var UserScreen = require('./components/screens/user.jsx');

context
  .createRoute('about', {
    path: '/about',
    title: 'About',
    body: AboutScreen
  })
  .createRoute('home', {
    path: '/',
    title: 'Home',
    body: HomeScreen
  })
  .createRoute('signin', {
    path: '/signin',
    body: SignInScreen
  })
  .createRoute('signout', {
    path: '/signout',
    body: SignOutScreen
  })
  .createRoute('user', {
    path: '/user',
    title: 'User',
    body: UserScreen
  })
  .createErrorRoute(404, {
    title: 'Not Found',
    body: ErrorScreen
  })
  .createErrorRoute(500, {
    title: 'Unexpected Error',
    body: ErrorScreen
  });
