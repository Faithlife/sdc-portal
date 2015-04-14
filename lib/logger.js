'use strict';

/**
 * An isomorphic Logger.
 */
var bunyan = require('bunyan');
var debug = require('debug');
var IsoBunyanStream = require('iso-bunyan-stream');
var logger = bunyan.createLogger({ name: 'sdc-portal', streams: [] });

// Wire existing debug configuration, which is required by the browser.
debug.enable(process.env.DEBUG);

// However, disable any persistence debug wants to do.
debug.disable();

/**
 * For convenience and compatibility with `console`, map `logger.log` to info.
 */
logger.log = logger.info;

/**
 * Returns a WritableStream-compatible interface to the specified `level` of
 * this Logger.
 */
logger.asStream = function asStream(level) {
  return {
    write: function write(chunk) {
      logger[level](chunk.replace(/\n$/, ''));
    }
  };
};

/**
 * Use a consistent, easy-to-read, browser-compatible stream on both sides.
 */
logger.addStream({
  level: debug.enabled('sdc-portal') ? 'debug' : 'info',
  type: 'raw',
  stream: new IsoBunyanStream()
});

// TODO(schoon) - If we're on the server, send verbose logs to syslog and/or
// a file. Alternatively, log verbosely if run within a Docker container.

/*!
 * Export `logger`.
 */
module.exports = logger;
