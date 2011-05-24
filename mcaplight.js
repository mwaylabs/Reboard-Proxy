/*!
 *
 * mcaplight.js
 *
 * Copyright(c) 2011 M-WAY Solutions GmbH
 * GPLv3 Licensed
 *
 * @author pfleidi
 *
 */

var NAME = 'M-WAY Solutions mCAP Light';
var VERSION = '0.2';

var Util = require('util');
var Fs = require('fs');
var Connect = require('connect');
var Proxy = require('./lib/proxy');
var log4js = require('log4js')();

// Load configuration
var CONF = JSON.parse(Fs.readFileSync(__dirname + '/conf/mcaplight.json', 'utf8'));

var errorlog = log4js.getLogger('errorlog');
errorlog.setLevel('ERROR');
log4js.addAppender(log4js.fileAppender(__dirname + '/log/mcaplight.log'));
log4js.addAppender(log4js.fileAppender(__dirname + '/log/error.log'), errorlog);

var log = log4js.getLogger('reboard');
log.setLevel(CONF.loglevel || 'DEBUG');

/*
 * register error handler for uncaught exceptions
 */
process.on('uncaughtException', function (err) {
    if (err.code === 'EACCES') {
      errorlog.fatal(NAME + ' needs to run as root when using a port < 1024.'
        + 'You need to configure a higher port number in conf/mcaplight.json!');
      process.exit(1);
    }

    errorlog.fatal(err.stack);
  });

function runServer(server, port) {
  server.listen(port, function () {
      log.info(NAME + ' ' + VERSION + ' successfully listening on PORT '  + port);
    });
}

var httpServer = Proxy.createProxy({
    log: log,
    url: CONF.server
  });

var httpPort = CONF.port || 8080;
runServer(httpServer, httpPort);

Fs.readFile(__dirname + '/cert/server.pem', function (err, certificate) {

    if (err) {
      log.fatal('Certificate could not be read. Skipping HTTPS support.');
      return;
    }

    var httpsPort = CONF.sslport || 8443;
    var httpsServer = Proxy.createProxy({
        log: log,
        url: CONF.server,
        cert: certificate
      });

    runServer(httpsServer, httpsPort);
  });
