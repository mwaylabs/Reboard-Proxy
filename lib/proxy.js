/*!
 * proxy.js is the main reverse proxy module for mCAP Light
 *
 * Copyright(c) 2011 M-WAY Solutions GmbH
 * GPLv3 Licensed
 *
 * @author pfleidi
 */

var Wwwdude = require('wwwdude');
var Connect = require('connect');

var client = Wwwdude.createClient({
    'user-agent': 'mCAPlight',
    gzip: false 
  });

exports.createProxy = function (options) {
  var log = options.log;
  var serviceUrl = options.url;
  var certificate = options.cert;

  function _handleRequest(request, response, next) {
    var payload = request.rawBody;
    var headers = request.headers;
    // work around gzip compression
    delete headers['accept-encoding'];
    var method = request.method.replace('DELETE', 'del').toLowerCase();

    function _cleanHeaders(resp) {
      delete resp.headers['content-length'];
      delete resp.headers['connection'];
      delete resp.headers['if-none-match'];
      delete resp.headers['content-encoding'];
    }

    function _respondNetError(err) {
      log.error('Network Error in proxy: ' + err);
      log.debug('Stack: ' + err.stack);

      response.writeHead(500);
      response.end(err.toString());
    }

    function _respondRequestError(err, resp) {
      log.error('HTTP Error in proxy: ' + err + ' status: ' + resp.statusCode);
      log.debug('Stack: ' + err.stack);
      _cleanHeaders(resp);

      response.writeHead(500);
      response.end(err);
    }

    function _respondRequestSuccess(data, resp) {
      _cleanHeaders(resp);

      response.writeHead(200, resp.headers);
      response.end(data);
    }

    log.debug('Calling ' + serviceUrl);
    var startTime = new Date();

    client[method](serviceUrl, {
        payload: payload,
        headers: headers
      })
    .on('error', function (err) {
        _respondNetError(err);
      })
    .on('http-error', function (err, resp) {
        _respondRequestError(err, resp);
      })  
    .on('success', function (data, resp) {
        _respondRequestSuccess(data, resp);
      })  
    .on('complete', function (data, resp) {
        var elapsed = (new Date() - startTime) / 1000;
        log.debug('Finished request to: ' + serviceUrl + ' time needed: ' + elapsed);
      });
  }

  if (certificate) {
    return Connect({
        key: certificate,
        cert: certificate
      },
      Connect.bodyParser(),
      Connect.router(function (app) {
          app.get('/', _handleRequest);
          app.post('/', _handleRequest);
        }),
      Connect.errorHandler({showStack: true, dumpExceptions: true})

    );
  } else {
    return Connect(
      Connect.bodyParser(),
      Connect.router(function (app) {
          app.get('/', _handleRequest);
          app.post('/', _handleRequest);
        }),
      Connect.errorHandler({showStack: true, dumpExceptions: true})

    );
  }

};
