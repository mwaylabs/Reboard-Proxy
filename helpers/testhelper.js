/*!
 * Test helper with echo server
 *
 * Copyright(c) 2011 M-WAY Solutions GmbH
 * GPLv3 Licensed
 *
 * @author pfleidi
 */

exports.port = 42230;

var Connect = require('connect');
var log = require('log4js')().getLogger();

exports.echoServer = function echoServer() {
  var port = exports.port;
  exports.port += 1;

  var server = Connect.createServer(
    Connect.bodyParser(),
    Connect.router(function (app) {
        app.post('/', handler);
        app.get('/', handler);
      })
  );

  function _getRequestJSON(request) {
    var req = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      payload: request.rawBody
    };

    return JSON.stringify(req);
  }

  function handler(request, response, next) {
    var payload = _getRequestJSON(request);

    var headers = { 
      'content-type': 'application/json',
      'x-test1': 'ASDF1',
      'x-test2': 'ASDF2'
    };

    response.writeHead(200, headers);

    if (request.method !== 'HEAD') {
      response.write(payload);
    }

    response.end();
    server.close();
  }

  server.listen(port, 'localhost');

  return {
    url: 'http://localhost:' + port,
    serv: server
  };
};
